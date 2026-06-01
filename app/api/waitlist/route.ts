import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // If no valid API key is set, we just mock the success so the UI works
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Waitlist Mock] Registered: ${email}`);
      // Artificial delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({ success: true, mocked: true });
    }

    const { data, error } = await resend.emails.send({
      // You must verify this domain in Resend before sending from it
      from: "Football Nexus <waitlist@footballnexus.com>",
      to: [email],
      subject: "Welcome to the Football Nexus Waitlist",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to the Future of Football Intelligence</h2>
          <p>Thank you for joining the Football Nexus waitlist.</p>
          <p>We're building the ultimate operating system for football fans, and we can't wait to share it with you before the 2026 World Cup.</p>
          <p>Stay tuned for early access updates.</p>
          <br />
          <p>Best,<br/>The Football Nexus Team</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
