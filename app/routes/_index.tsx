import {
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async (args: ActionFunctionArgs) => {
  const request = args.request;
  const body = await request.formData();

  console.log(body);

  const token = body.get("cf-turnstile-response");
  const ip = request.headers.get("CF-Connecting-IP");
  console.log("token", token);
  console.log("ip", ip);

  let formData = new FormData();
  formData.append("secret", "0x4AAAAAAALWzt5w_2MT99qhTxGI_DD9Bmw");
  token && formData.append("response", token);
  ip && formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  console.log(outcome);
  return redirect("/test");
};

export default function Index() {
  useEffect(() => {
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;

      document.body.appendChild(script);
    }, 2000);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <Form method="post">
        <div
          className="cf-turnstile"
          data-sitekey="0x4AAAAAAALWzgGWskzdV7VH"
          data-theme="light"
        ></div>
        <button type="submit">submit</button>
      </Form>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
