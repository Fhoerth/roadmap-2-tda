package tracker.scripts;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.interfaces.MongoScript;
import tracker.models.Problem;
import tracker.models.Task;
import tracker.repositories.ProblemRepository;
import tracker.utils.Logger;

@Component
public class V4__addFieldsToTasks implements MongoScript {
  private String name = "v4__add-fields-to-tasks";
  private String id = "v4__add-fields-to-tasks";

  private ProblemRepository problemRepository;

  @Autowired
  public V4__addFieldsToTasks(ProblemRepository problemRepository) {
    this.problemRepository = problemRepository;
  }

  @Override
  public boolean run() {
    try {
      List<Problem> problems = problemRepository.findAll();

      for (Problem problem : problems) {
        List<Task> tasks = problem.getTasks();

        for (Task task : tasks) {
          String url = task.getUrl();
          String[] urlSegments = url.split("/");
          String slug = urlSegments[urlSegments.length - 1];
          String editCodeUrl = "/problems/" + slug + "/";

          task.setSlug(slug);
          task.setEditCodeUrl(editCodeUrl);
        }

        problem.setTasks(tasks);
        problemRepository.save(problem);
      }

      Logger.printGreen("V4__addFieldsToTasks script run successfully");
      return true;
    } catch (Exception exception) {
      Logger.printRed("V4__addFieldsToTasks script run unsuccessfully");
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
