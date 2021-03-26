import React from "react";

const Mailchimp = () => {
  return (
    <>
      <link
        href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css"
        rel="stylesheet"
        type="text/css"
      />
      <style type="text/css">
        {`#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }`}
      </style>
      <div id="mc_embed_signup">
        <form
          action="https://netlify.us7.list-manage.com/subscribe/post?u=5516b44736a1481fff25a05f1&amp;id=54b37d926d"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL">Email Address </label>
              <input
                type="email"
                defaultValue=""
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
              />
            </div>
            <div id="mce-responses" className="clear">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              ></div>
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              ></div>
            </div>
            <div
              style={{ position: "absolute", left: -5000 }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_5516b44736a1481fff25a05f1_54b37d926d"
                tabIndex={-1}
                value=""
              />
            </div>
            <div className="clear">
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Mailchimp;
