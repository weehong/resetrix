import { useEffect } from "react";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { ContactForm } from "@/components/marketing-interactive";

vi.mock("next/script", () => ({
	default: function MockScript({ onReady }: { onReady: () => void }) {
		useEffect(() => {
			onReady();
		}, [onReady]);
		return null;
	},
}));

type WidgetOptions = Parameters<NonNullable<Window["turnstile"]>["render"]>[1];
let options: WidgetOptions;
let widgetCount = 0;
const remove = vi.fn();
const send = vi.fn();

beforeEach(() => {
	widgetCount = 0;
	vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
	window.turnstile = {
		render: (_container, callbacks) => {
			options = callbacks;
			return `widget-${++widgetCount}`;
		},
		remove,
	};
	vi.stubGlobal("fetch", send);
});

afterEach(() => {
	cleanup();
	delete window.turnstile;
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	vi.resetAllMocks();
});

function mountForm() {
	const { container } = render(<ContactForm />);
	const form = container.querySelector("form")!;
	fireEvent.change(screen.getByLabelText("Name"), {
		target: { value: "Alex" },
	});
	return form;
}

test("requires verification and excludes the honeypot from navigation", () => {
	const form = mountForm();
	fireEvent.submit(form);
	expect(send).not.toHaveBeenCalled();
	expect(
		screen.getByText(/please complete the verification before/i)
	).toBeVisible();
	expect(screen.getByLabelText("Leave this field empty")).not.toBeVisible();
	expect(screen.getByLabelText("Leave this field empty")).toHaveAttribute(
		"tabindex",
		"-1"
	);
});

test("sends the token, resets the form on success, and obtains a new widget", async () => {
	send.mockResolvedValue(new Response(null, { status: 200 }));
	const form = mountForm();
	act(() => {
		options.callback("verified-token");
	});
	fireEvent.submit(form);
	await waitFor(() =>
		expect(
			screen.getByText(/thanks. your enquiry has been sent/i)
		).toBeVisible()
	);
	expect(JSON.parse(send.mock.calls[0]![1].body)).toMatchObject({
		name: "Alex",
		website: "",
		"cf-turnstile-response": "verified-token",
	});
	expect(screen.getByLabelText("Name")).toHaveValue("");
	expect(remove).toHaveBeenCalledWith("widget-1");
	await waitFor(() => expect(widgetCount).toBe(2));
	fireEvent.submit(form);
	expect(send).toHaveBeenCalledTimes(1);
});

test.each([
	[403, /verification failed or expired/i],
	[429, /too many attempts/i],
	[503, /verification is temporarily unavailable/i],
])(
	"handles HTTP %s without JSON and preserves details for retry",
	async (status, message) => {
		send.mockResolvedValue(
			new Response("Firewall or upstream error", { status })
		);
		const form = mountForm();
		act(() => {
			options.callback("first-token");
		});
		fireEvent.submit(form);
		await waitFor(() => expect(screen.getByText(message)).toBeVisible());
		expect(screen.getByLabelText("Name")).toHaveValue("Alex");
		await waitFor(() => expect(widgetCount).toBe(2));
		fireEvent.submit(form);
		expect(send).toHaveBeenCalledTimes(1);
		act(() => {
			options.callback("fresh-token");
		});
		fireEvent.submit(form);
		await waitFor(() => expect(send).toHaveBeenCalledTimes(2));
		expect(
			JSON.parse(send.mock.calls[1]![1].body)["cf-turnstile-response"]
		).toBe("fresh-token");
	}
);

test.each(["expired-callback", "error-callback", "timeout-callback"] as const)(
	"invalidates tokens on %s and supports retry",
	(callback) => {
		const form = mountForm();
		act(() => {
			options.callback("old-token");
		});
		act(() => {
			options[callback]();
		});
		fireEvent.submit(form);
		expect(send).not.toHaveBeenCalled();
		fireEvent.click(screen.getByRole("button", { name: "Retry verification" }));
		expect(remove).toHaveBeenCalledWith("widget-1");
		expect(widgetCount).toBe(2);
		expect(screen.getByLabelText("Name")).toHaveValue("Alex");
	}
);

test("blocks duplicate submissions while a request is in flight", async () => {
	let finish!: (response: Response) => void;
	send.mockImplementation(
		() =>
			new Promise<Response>((resolve) => {
				finish = resolve;
			})
	);
	const form = mountForm();
	act(() => {
		options.callback("verified-token");
	});
	fireEvent.submit(form);
	fireEvent.submit(form);
	expect(send).toHaveBeenCalledTimes(1);
	expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
	await act(async () => {
		finish(new Response(null, { status: 200 }));
	});
});

test("shows an actionable message when the public key is missing", () => {
	vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
	mountForm();
	expect(
		screen.getByText(/verification is unavailable or has expired/i)
	).toBeVisible();
	expect(widgetCount).toBe(0);
});
