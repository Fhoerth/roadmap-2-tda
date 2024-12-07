package tracker.scripts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.interfaces.MongoScript;
import tracker.models.Problem;
import tracker.models.Task;
import tracker.repositories.ProblemRepository;

@Component
public class V1__ProblemsScript implements MongoScript {
  private String name = "problems-script";
  private String id = "problems-script";

  private ProblemRepository problemRepository;

  @Autowired
  public V1__ProblemsScript(ProblemRepository problemRepository) {
    this.problemRepository = problemRepository;
  }

  @Override
  public boolean run() {
    ObjectMapper objectMapper = new ObjectMapper();

    try {
      File file = new File("src/main/resources/problems.json");
      JsonNode rootNode = objectMapper.readTree(file);

      List<Problem> problems = new ArrayList<>();

      for (JsonNode categoryNode : rootNode) {
        String name = categoryNode.get("name").asText();
        Integer level = categoryNode.get("level").asInt();

        List<Task> tasks = new ArrayList<>();

        for (JsonNode problemNode : categoryNode.get("problems")) {
          Integer problemId = problemNode.get("id").asInt();
          String problemName = problemNode.get("name").asText();
          String problemDifficulty = problemNode.get("difficulty").asText();
          String problemUrl = problemNode.get("url").asText();

          tasks.add(new Task(problemId, problemName, problemDifficulty, problemUrl, "", ""));
        }

        problems.add(new Problem(level, name, tasks));
      }

      problemRepository.saveAll(problems);

      return true;
    } catch (IOException exception) {
      exception.printStackTrace(); // Esto te dará más detalles sobre el error.
      return false;
    }
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getName() {
    return name;
  }
}
