package tracker.initializers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import tracker.services.MongoScriptsExecutionService;
import tracker.utils.Logger;

@Component
public class Initializer implements ApplicationListener<ApplicationReadyEvent> {
  private MongoScriptsExecutionService mongoScriptsExecutionService;

  @Autowired
  public Initializer(MongoScriptsExecutionService mongoScriptsExecutionService) {
    this.mongoScriptsExecutionService = mongoScriptsExecutionService;
  }

  @Override
  public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
    Logger.printGreen("Application ready...");
    runInitializers();
  }

  public void runInitializers() {
    Logger.printPurple("Running initializers...");
    mongoScriptsExecutionService.run();
  }
}
