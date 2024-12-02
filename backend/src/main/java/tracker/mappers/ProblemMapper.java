package tracker.mappers;

import java.util.List;
import java.util.stream.Collectors;

import tracker.dto2.ProblemDTO;
import tracker.models.Problem;

public class ProblemMapper {
  public static ProblemDTO toDTO(Problem problem) {
    return new ProblemDTO(problem.getId(), problem.getLevel(), problem.getName(),
        TaskMapper.toDTOList(problem.getTasks()));
  }

  public static List<ProblemDTO> toDTOList(List<Problem> problems) {
    return problems.stream().map(ProblemMapper::toDTO).collect(Collectors.toList());
  }
}
