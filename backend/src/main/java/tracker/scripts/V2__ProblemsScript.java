package tracker.scripts;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.infra.Environment;
import tracker.interfaces.MongoScript;

@Component
public class V2__ProblemsScript implements MongoScript {
  @Autowired
  private MongoClient mongoClient;

  private String name = "v2__problems-script-2.0";
  private String id = "v2__problems-script-2.0";

  @Override
  public boolean run() {
    MongoDatabase database = mongoClient.getDatabase(Environment.getMongoDatabase());
    MongoCollection<Document> collection = database.getCollection("problems");
    Document renameOperation = new Document("$rename", new Document("problems", "tasks"));
    collection.updateMany(new Document(), renameOperation);

    return true;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }
}
