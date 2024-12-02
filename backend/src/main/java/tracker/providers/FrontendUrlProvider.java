package tracker.providers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FrontendUrlProvider {
  @Value("${app.frontend-url}")
  private String frontendUrl;

  public String getFrontendUrl() {
    return frontendUrl;
  }
}
