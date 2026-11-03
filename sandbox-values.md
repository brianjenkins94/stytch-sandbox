> ## Documentation Index
> Fetch the complete documentation index at: https://stytch.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Sandbox Values

> Sandbox values for testing in a Test environment

Stytch provides sandbox values which can be used to receive sample responses in Test environments. The sandbox values below are only available when calling the Stytch API directly. They will not work when used with a frontend or mobile Stytch SDK.

## Magic Links

In some scenarios, it may be helpful to test sending a magic link without actually sending an email. You can use the email address `sandbox@stytch.com` to test sending a magic link. If your API credentials and the request format are correct you will receive a 200 status response, but no email will actually be sent.

You can use the following tokens in the `/magic_links/authenticate` endpoint and receive the corresponding responses.

* 200 Success: `DOYoip3rvIMMW5lgItikFK-Ak1CfMsgjuiCyI7uuU94=`
* 401 `unable_to_auth_magic_link`: `3pzjQpgksDlGKWEwUq2Up--hCHC_0oamfLHyfspKDFU=`
* 404 `magic_link_not_found`: `CprTtwhnRNiMBiUS2jSLcWYrfuO2POeBNdo5HhW6qTM=`

## One-time Passcodes (OTP)

In some scenarios, it may be helpful to test sending a One-time Passcode (OTP) without actually sending a message. You can use the phone number +10000000000, for our `/otps/sms/send` and `/otps/whatsapp/send` endpoints, and [sandbox@stytch.com](mailto:sandbox@stytch.com) for our `/otps/email/send` endpoint, to test sending an OTP in a Test environment. If your API credentials and the request format are correct, you will receive a 200 status response but no message will actually be sent.

You can use the following code, and the `method_id` you received in the 200 response from `/otps/xxx/send`, in the `/otps/authenticate` endpoint and receive the corresponding response.

* 200 Success: `000000`

## OAuth Logins

The following `token`s can be used in order to test the /v1/oauth/authenticate endpoint.

* 200 Success: `hdPVZHHX0UoRa7hJTuuPHi1vlddffSnoweRbVFf5-H8g`
* 400 `oauth_token_not_found`: `59cnLELtq5cFVS6uYK9f-pAWzBkhqZl8AvLhbhOvKNWw`

## Session Management

You can use the following `session_token`s to test the `/sessions/authenticate` endpoint.

* 200 Success: `WJtR5BCy38Szd5AfoDpf0iqFKEt4EE5JhjlWUY7l3FtY`
* 404 `session_not_found`: `59cnLELtq5cFVS6uYK9f-pAWzBkhqZl8AvLhbhOvKNWw`

## Passwords

If you pass the email address `sandbox@stytch.com` into the `/passwords` or the `/passwords/authenticate` endpoints, you will receive a 200 response regardless of the `password` value specified.

If you pass the email address `sandbox@stytch.com` into the `/passwords/email/reset/start` endpoint, you will receive a 200 response without sending an actual password reset email.

You can use the following `token` values to test the `/passwords/email/reset` endpoint:

* 200 Success: `Xh8QnB4h_9Qe0d1DQcFAoW6rImuq4wBQZ-hHtwzFIg_E`
* 401 `unable_to_auth_magic_link`: `alpFprsAkyUy_Pg3WWYlKL-yGgYXspnJo0SbS3-Djuij`

## Crypto Wallets

The following crypto wallet address can be used in order to test the `/v1/crypto_wallets/authenticate/start` and `/v1/crypto_wallets/authenticate` endpoints along with the `ethereum` wallet type.

* 200 Success: `0x6df2dB4Fb3DA35d241901Bd53367770BF03123f1-H8g`

## Time-based One-time Passcodes (TOTP)

To test the creation of TOTPs you can use the following `user_id` in a Test environment with the `/v1/totps` endpoint. You can use the same `user_id` to test `/v1/totps/recovery_codes` as well.

* `user_id`: `user-test-e3795c81-f849-4167-bfda-e4a6e9c280fd`

You can use the following `totp_codes` along with the above `user_id` to test the `/v1/totps/authenticate` endpoint.

* 200 Success: `000000`
* 401 `unable_to_authenticate_totp`: `401401`

You can use the following `recovery_code`s along with the above `user_id` to test the `/v1/totps/recover` endpoint.

* 200 Success: `a1b2-c3d4-e5f6`
* 401 `unable_to_authenticate_recovery_code`: `0u1v-2w3x-4y5z`
