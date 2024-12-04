import Avatar from "@mui/material/Avatar";
import { yellow, red, green } from "@mui/material/colors";

export default function PriorityAvatar({ priority }: { priority: number }) {
  const priorityColors = [green[800], yellow[800], red[800]];
  const labelText = ["ISBN Number", "Author's Name", "Book Title"];

  return (
    <Avatar sx={{ width: 120, height: 70, bgcolor: priorityColors[2] }} variant="rounded">
      {labelText[priority - 1]}
    </Avatar>
  );
}
