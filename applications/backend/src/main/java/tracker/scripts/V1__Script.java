package tracker.scripts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.interfaces.MongoScript;
import tracker.models.Level;
import tracker.models.Problem;
import tracker.providers.MongoDbProvider;
import tracker.repositories.LevelRepository;
import tracker.repositories.ProblemRepository;

@Component
public class V1__Script implements MongoScript {
  private String name = "v1__Script";
  private String id = "v1__Script";

  private MongoClient mongoClient;
  private MongoDbProvider mongoDbProvider;
  private LevelRepository levelRepository;
  private ProblemRepository problemRepository;

  @Autowired
  public V1__Script(MongoClient mongoClient, MongoDbProvider mongoDbProvider, LevelRepository levelRepository,
      ProblemRepository problemRepository) {
    this.mongoClient = mongoClient;
    this.mongoDbProvider = mongoDbProvider;
    this.levelRepository = levelRepository;
    this.problemRepository = problemRepository;
  }

  @Data
  private class AdditionalFields {
    private String slug;
    private String editCodeUrl;

    public AdditionalFields(String url) {
      String[] urlSegments = url.split("/");
      String slug = urlSegments[urlSegments.length - 1];
      String editCodeUrl = "/problems/" + slug + "/";

      this.slug = slug;
      this.editCodeUrl = editCodeUrl;
    }
  }

  @Override
  public boolean run() {
    MongoDatabase database = mongoClient.getDatabase(mongoDbProvider.getMongoDb());

    database.getCollection("levels").drop();
    database.getCollection("problems").drop();

    ObjectMapper objectMapper = new ObjectMapper();

    try {
      File file = new File("src/main/resources/problems.json");
      JsonNode rootNode = objectMapper.readTree(file);

      List<Level> levels = new ArrayList<>();
      List<Problem> problems = new ArrayList<>();

      for (JsonNode levelNode : rootNode) {
        String nameField = levelNode.get("name").asText();
        Integer levelField = levelNode.get("level").asInt();

        Level level = new Level(nameField, levelField);

        levels.add(level);
        levelRepository.save(level);

        for (JsonNode problemNode : levelNode.get("problems")) {
          System.out.println(problemNode);
          Integer problemIdField = problemNode.get("id").asInt();
          String problemNameField = problemNode.get("name").asText();
          String problemDifficultyField = problemNode.get("difficulty").asText();
          String problemUrlField = problemNode.get("url").asText();
          AdditionalFields additionalFields = new AdditionalFields(problemUrlField);

          Problem problem = new Problem(level.getId(), problemIdField, problemNameField, problemDifficultyField,
              problemUrlField, additionalFields.getEditCodeUrl(), additionalFields.getSlug());

          problems.add(problem);
        }
      }

      problemRepository.saveAll(problems);

      return true;
    } catch (IOException exception) {
      exception.printStackTrace();
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
