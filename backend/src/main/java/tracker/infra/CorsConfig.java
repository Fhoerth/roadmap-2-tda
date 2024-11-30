package tracker.infra;

import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
  @Bean
  public CorsFilter corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();

    String frontendUrl = Environment.getFrontendUrl();

    config.setAllowedOrigins(Collections.singletonList(frontendUrl));
    config.setAllowedMethods(Collections.singletonList("*")); // Todos los métodos HTTP permitidos
    config.setAllowedHeaders(Collections.singletonList("*")); // Todos los headers permitidos
    source.registerCorsConfiguration("/**", config);

    return new CorsFilter(source);
  }
}
