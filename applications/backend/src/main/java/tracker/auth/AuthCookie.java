package tracker.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.exceptions.AuthCookieEncodeException;
import tracker.exceptions.AuthCookieParseException;
import tracker.exceptions.MissingAuthCookieException;
import tracker.models.User;
import tracker.services.security.EncryptionService;
import tracker.services.security.KeyService;

@Component
public class AuthCookie {
  private final String AUTH_COOKIE_NAME = "X-Tracker-Auth";
  private final Integer ONE_MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

  private HttpServletRequest request;
  private KeyService keyService;
  private EncryptionService encryptionService;
  private TokenSerializer tokenSerializer;

  @Autowired
  public AuthCookie(HttpServletRequest request, KeyService keyService, EncryptionService encryptionService,
      TokenSerializer tokenSerializer) {
    this.request = request;
    this.keyService = keyService;
    this.encryptionService = encryptionService;
    this.tokenSerializer = tokenSerializer;
  }

  private Cookie findAuthCookie() {
    Cookie[] cookies = request.getCookies();

    if (cookies == null)
      return null;

    for (var cookie : cookies)
      if (cookie.getName().equals(AUTH_COOKIE_NAME))
        return cookie;

    return null;
  }

  public Token parseAuthCookie() throws MissingAuthCookieException {
    Cookie authCookie = findAuthCookie();

    if (authCookie == null || authCookie.getValue() == null)
      throw new MissingAuthCookieException("Missing Auth Cookie.");

    String entryptedBase64StrinfifiedToken = authCookie.getValue();

    try {
      byte[] unsignedSecretKey = keyService.getUnsignedSecretKey();
      String stringifiedToken = encryptionService.base64Decrypt(entryptedBase64StrinfifiedToken, unsignedSecretKey);
      Token token = tokenSerializer.deserialize(stringifiedToken);

      return token;
    } catch (Exception exception) {
      throw new AuthCookieParseException("Unable to parse Auth Cookie.");
    }
  }

  public Cookie createExpiedCookie() {
    Cookie cookie = new Cookie(AUTH_COOKIE_NAME, "");

    cookie.setPath("/");
    cookie.setSecure(true);
    cookie.setHttpOnly(true);
    cookie.setMaxAge(0);

    return cookie;
  }

  public Cookie createSecureAuthCookie(User user) {
    Token token = new Token(user);

    try {
      byte[] unsignedSecretKey = keyService.getUnsignedSecretKey();
      String stringifiedToken = tokenSerializer.serialize(token);
      String encryptedBase64StringifiedToken = encryptionService.base64Encrypt(stringifiedToken, unsignedSecretKey);

      Cookie cookie = new Cookie(AUTH_COOKIE_NAME, encryptedBase64StringifiedToken);

      cookie.setPath("/");
      cookie.setSecure(true);
      cookie.setHttpOnly(true);
      cookie.setMaxAge(ONE_MONTH_IN_SECONDS);

      return cookie;
    } catch (Exception exception) {
      throw new AuthCookieEncodeException("Error while encoding Auth Cookie.");
    }
  }
}
