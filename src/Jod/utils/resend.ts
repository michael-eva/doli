export async function sendVerification(email: string) {
  try {
    const response = await fetch("/.netlify/functions/sendVerificationEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      console.log("Email sent successfully");
    } else {
      console.error(
        "Failed to send email:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch data from serverless function");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function sendRejection(email: string, reason: string) {
  try {
    const response = await fetch("/.netlify/functions/sendRejectEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, reason }),
    });

    if (response.ok) {
      console.log("Email sent successfully");
    } else {
      console.error(
        "Failed to send email:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch data from serverless function");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function sendEnquiry(
  email: string | undefined,
  message: string,
  subject: string
) {
  if (!email) {
    throw new Error("Email is required");
  }

  const response = await fetch("/.netlify/functions/sendEnquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, message, subject }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Server error:", errorData);
    throw new Error("Failed to send email");
  }

  return response;
}
