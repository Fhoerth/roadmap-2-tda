package tracker.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;
import tracker.models.User;
import tracker.services.db.UserService;

@Component
@RequestScope
public class AuthenticatedUserComponent {
  private User user;

  @Autowired
  public AuthenticatedUserComponent(AuthCookie authCookie, UserService userService) {
    Token token = authCookie.parseAuthCookie();
    User tokenUser = token.getUser();

    this.user = tokenUser;
  }

  public User getUser() {
    return user;
  }
}
