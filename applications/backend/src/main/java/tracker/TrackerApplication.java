package tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.context.request.RequestContextListener;
import tracker.utils.Logger;

@SpringBootApplication
public class TrackerApplication {
  public static void main(String[] args) {
    ConfigurableApplicationContext context = SpringApplication.run(TrackerApplication.class, args);
    String serverPort = context.getEnvironment().getProperty("server.port");
    Logger.printGreen("Server is running on port: " + serverPort);
  }

  @Bean
  public ServletListenerRegistrationBean<RequestContextListener> requestContextListener() {
    return new ServletListenerRegistrationBean<>(new RequestContextListener());
  }
}
