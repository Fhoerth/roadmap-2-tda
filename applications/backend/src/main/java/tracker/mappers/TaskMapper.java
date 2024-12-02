package tracker.mappers;

import java.util.List;
import java.util.stream.Collectors;
import tracker.DTO.TaskDTO;
import tracker.models.Task;

public class TaskMapper {
  public static TaskDTO toDTO(Task task) {
    return new TaskDTO(task.getId(), task.getName(), task.getDifficulty(), task.getUrl());
  }

  public static List<TaskDTO> toDTOList(List<Task> tasks) {
    return tasks.stream().map(TaskMapper::toDTO).collect(Collectors.toList());
  }
}
