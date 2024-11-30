package tracker.services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.interfaces.MongoScript;
import tracker.models.Script;
import tracker.repositories.ScriptRepository;
import tracker.utils.Logger;

@Service
public class MongoScriptsExecutionService {
  @Autowired
  private ScriptRepository scriptRepository;

  private List<MongoScript> scripts = new ArrayList<>();

  @Autowired
  public MongoScriptsExecutionService(List<MongoScript> scripts) {
    this.scripts.addAll(scripts);
  }

  public void run() {
    Logger.printPurple("Running Mongo Scripts.");

    for (int i = 0; i < scripts.size(); i += 1) {
      MongoScript script = scripts.get(i);
      String scriptId = script.getId();

      if (!hasScriptRun(scriptId)) {
        String scriptName = script.getName();

        Logger.printYellow("Running Mongo script: ".concat(script.getName()));

        Boolean hasRun = script.run();

        if (hasRun) {
          markScriptAsExecuted(scriptId, scriptName);
          Logger.printYellow("Mongo script: ".concat(script.getName()).concat(" run successfully."));
        } else {
          Logger.printRed("Mongo script: ".concat(script.getName()).concat(" run unsuccessfully."));
        }
      }
    }
  }

  private boolean hasScriptRun(String scriptId) {
    return scriptRepository.findByScriptId(scriptId).isPresent();
  }

  private void markScriptAsExecuted(String scriptId, String name) {
    Script script = new Script(scriptId, name, true);
    scriptRepository.save(script);
  }
}
