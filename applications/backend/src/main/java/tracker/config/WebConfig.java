package tracker.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tracker.auth.AuthenticatedUserArgumentResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private final AuthenticatedUserArgumentResolver authenticatedUserArgumentResolver;

  @Autowired
  public WebConfig(AuthenticatedUserArgumentResolver authenticatedUserArgumentResolver) {
    this.authenticatedUserArgumentResolver = authenticatedUserArgumentResolver;
  }

  @Override
  public void addArgumentResolvers(@NonNull List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(authenticatedUserArgumentResolver);
  }
}
