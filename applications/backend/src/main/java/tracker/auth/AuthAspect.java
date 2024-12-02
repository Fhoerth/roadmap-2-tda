package tracker.auth;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.exceptions.UnauthorizedException;
import tracker.models.User;
import tracker.services.db.UserService;

@Aspect
@Component
public class AuthAspect {
  private AuthCookie authCookie;
  private UserService userService;

  @Autowired
  public AuthAspect(AuthCookie authCookie, UserService userService) {
    this.authCookie = authCookie;
    this.userService = userService;
  }

  private boolean isAuthorized() throws Exception {
    Token token = authCookie.parseAuthCookie();
    User tokenUser = token.getUser();

    return userService.isValidUser(tokenUser);
  }

  @Before("@annotation(Auth)")
  public void validateCookie() throws Exception {
    try {
      if (!isAuthorized()) {
        throw new UnauthorizedException("Unauthorized");
      }
    } catch (Exception exception) {
      throw new UnauthorizedException("Unauthorized");
    }
  }
}
