import * as React from "react";

export const ResetPasswordTemplate = ({ emailAddress, key }) => {
  return (
    <div>
      <p>Hello,</p> <br />
      <p>
        Someone recently requested a password reset for the SuperAgent account
        with email address "<a>{emailAddress}</a>"
      </p>
      <br />
      <p>Please use this link to reset the password for your account: </p>{" "}
      <br /> <br />
      <p>
        <a>https://superagent.com/reset_password?key=123455666</a>
      </p>
      <br />
      <p>
        {" "}
        Note: If you did not request a password reset, you can ignore this
        email.{" "}
      </p>
    </div>
  );
};
