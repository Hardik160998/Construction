import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, companyName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Insert into Supabase
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    );

    let { error: dbError } = await supabaseAdmin
      .from('contact')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          email: email,
          message: message,
        }
      ]);

    // If table doesn't exist, dbError.code could be '42P01' or the message might indicate a schema cache miss
    const isTableMissing = dbError && (dbError.code === '42P01' || dbError.message.includes('Could not find the table'));

    if (isTableMissing) {
      if (!process.env.DATABASE_URL) {
        return NextResponse.json({ 
          error: 'Database table is not created yet. Please add DATABASE_URL to your .env.local file so the system can auto-create it.' 
        }, { status: 500 });
      }

      console.log('Table missing. Attempting to auto-create using pg...');
      const { Client } = require('pg');
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      
      try {
        await client.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS public.contact (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            first_name text NOT NULL,
            last_name text NOT NULL,
            company_name text,
            email text NOT NULL,
            message text NOT NULL,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
          );
        `);
        
        // Notify Supabase to reload its schema cache
        await client.query(`NOTIFY pgrst, 'reload schema'`);

        console.log('Table created successfully. Retrying insert...');
        
        // Retry the insert after creating the table
        const retry = await supabaseAdmin
          .from('contact')
          .insert([
            {
              first_name: firstName,
              last_name: lastName,
              company_name: companyName,
              email: email,
              message: message,
            }
          ]);
          
        dbError = retry.error;
      } catch (err: any) {
        console.error('Failed to auto-create table:', err);
        return NextResponse.json({ error: `Failed to auto-create table: ${err.message}` }, { status: 500 });
      } finally {
        await client.end();
      }
    }

    if (dbError) {
      console.error('Supabase Error:', dbError.message);
      return NextResponse.json({ error: `Database Error: ${dbError.message}` }, { status: 500 });
    }

    // 2. Send Email Notification to Site Owner
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const ownerMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send email to the site owner
      replyTo: email,
      subject: `New BuilderFlow Demo Request from ${firstName} ${lastName}`,
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // 3. Send Confirmation Email to the User
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email, // Send to the user who filled out the form
      subject: `Thank you for contacting BuilderFlow, ${firstName}!`,
      html: `
        <h2>Hi ${firstName},</h2>
        <p>Thank you for requesting a demo of BuilderFlow. We have received your inquiry and our sales team will reach out to you shortly.</p>
        <br/>
        <p>Best regards,<br/>The BuilderFlow Team</p>
      `,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request. Check server logs.' }, { status: 500 });
  }
}
