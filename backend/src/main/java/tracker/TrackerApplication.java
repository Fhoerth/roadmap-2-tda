package tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class TrackerApplication {
  public static void main(String[] args) {
    ConfigurableApplicationContext context = SpringApplication.run(TrackerApplication.class, args);
    String serverPort = context.getEnvironment().getProperty("server.port");
    System.out.println("Server is running on port: " + serverPort);
  }
}
