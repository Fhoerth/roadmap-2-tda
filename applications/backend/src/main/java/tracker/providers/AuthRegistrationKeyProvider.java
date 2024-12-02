package tracker.providers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AuthRegistrationKeyProvider {
  @Value("${app.auth-registration-key}")
  private String authRegistrationKey;

  public String key() {
    return authRegistrationKey;
  }
}
