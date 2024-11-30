// package tracker.initializers;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;

// import tracker.services.ScriptExecutionService;
// import tracker.utils.Logger;

// import org.springframework.context.event.ContextRefreshedEvent;
// import org.springframework.context.event.EventListener;

// @Component
// public class MongoScriptsInitializer {
//   @Autowired
//   private ScriptExecutionService scriptExecutionService;

//   @EventListener(ContextRefreshedEvent.class)
//   public void init() {
//     Logger.printPurple("Initializing MongoScriptsInitializer");
//   }
// }

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
  @Autowired
  private MongoScriptsExecutionService mongoScriptsExecutionService;

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
