export interface TaskPatchBody {
  title?: string;
  description?: string;
  status?: "todo" | "doing" | "done";
}
