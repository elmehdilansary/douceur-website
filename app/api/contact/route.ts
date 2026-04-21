// /app/api/contact/route.ts — Server-side contact form handler with Zod validation and Resend email

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().optional(),
  email: z.string().email("Please provide a valid email address."),
  phone: z.string().optional(),
  role: z.enum(["Retailer", "Distributor", "Individual", "Other"], {
    error: "Please select a valid role.",
  }),
  message: z.string().min(10, "Message must be at least 10 characters."),
  honeypot: z.string().max(0, "Bot detected."),
});

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Validation failed.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, company, email, phone, role, message } = parsed.data;

    const toEmail = process.env.CONTACT_EMAIL ?? "contact@douceurmaroc.com";

    await resend.emails.send({
      from: "Douceur Maroc <no-reply@douceurmaroc.com>",
      to: toEmail,
      replyTo: email,
      subject: `New inquiry from ${name} — ${role}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FAF7F2; color: #1A1A1A;">
          <h1 style="font-size: 28px; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 32px; color: #1A1A1A;">
            New Message — Douceur Maroc
          </h1>
          <table style="width:100%; border-collapse: collapse;">
            ${[
              ["Name", name],
              ["Email", email],
              ["Phone", phone ?? "—"],
              ["Company", company ?? "—"],
              ["Role", role],
            ]
              .map(
                ([k, v]) => `
              <tr>
                <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; width: 120px; vertical-align: top; border-bottom: 0.5px solid #E2D5C8;">${k}</td>
                <td style="padding: 12px 0; font-size: 15px; color: #1A1A1A; border-bottom: 0.5px solid #E2D5C8;">${v}</td>
              </tr>`
              )
              .join("")}
          </table>
          <div style="margin-top: 32px;">
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; margin-bottom: 12px;">Message</p>
            <p style="font-size: 15px; line-height: 1.7; color: #1A1A1A;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <hr style="margin-top: 48px; border: none; border-top: 0.5px solid #E2D5C8;" />
          <p style="font-size: 11px; color: #7A6E65; margin-top: 16px;">Douceur Maroc</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
