package tracker.services.db;

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
  private ScriptRepository scriptRepository;
  private List<MongoScript> scripts = new ArrayList<>();

  @Autowired
  public MongoScriptsExecutionService(ScriptRepository scriptRepository, List<MongoScript> scripts) {
    this.scriptRepository = scriptRepository;
    this.scripts.addAll(scripts);
  }

  public void run() {
    Logger.printPurple("Running Mongo Scripts.");

    for (int i = 0; i < scripts.size(); i += 1) {
      MongoScript script = scripts.get(i);
      String scriptId = script.getId();
      String scriptName = script.getName();

      if (!hasScriptRun(scriptId)) {
        Logger.printPurple(String.format("Running Mongo script: %s.", scriptName));
        Boolean hasRun = script.run();

        if (hasRun) {
          markScriptAsExecuted(scriptId, scriptName);
          Logger.printPurple(String.format("Mongo script: %s run successfully.", scriptName));
        } else {
          Logger.printRed(String.format("Mongo script: %s run unsuccessfully.", scriptName));
        }
      } else {
        Logger.printYellow(String.format("Mongo script: %s has already run.", scriptName));
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
