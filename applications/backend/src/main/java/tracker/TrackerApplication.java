package tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import tracker.utils.Logger;

@SpringBootApplication
public class TrackerApplication {
  public static void main(String[] args) {
    ConfigurableApplicationContext context = SpringApplication.run(TrackerApplication.class, args);
    String serverPort = context.getEnvironment().getProperty("server.port");
    Logger.printGreen("Server is running on port: " + serverPort);
  }
}
