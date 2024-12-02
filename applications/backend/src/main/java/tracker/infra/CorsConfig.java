package tracker.infra;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import tracker.providers.FrontendUrlProvider;

@Configuration
public class CorsConfig {
  private FrontendUrlProvider frontendUrlProvider;

  @Autowired
  public CorsConfig(FrontendUrlProvider frontendUrlProvider) {
    this.frontendUrlProvider = frontendUrlProvider;
  }

  @Bean
  public CorsFilter corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();

    String frontendUrl = frontendUrlProvider.getFrontendUrl();

    config.setAllowedOrigins(Collections.singletonList(frontendUrl));
    config.setAllowedMethods(Collections.singletonList("*"));
    config.setAllowedHeaders(Collections.singletonList("*")); 
    source.registerCorsConfiguration("/**", config);

    return new CorsFilter(source);
  }
}
