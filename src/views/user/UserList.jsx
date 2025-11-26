import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "../../components/shared/DashboardCard";
import { API } from "../../api";

export default function UserList() {
  const [data, setData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await API.get("/auth/userList");
        // backend returns { success, message, data }
        if (mounted) setData(res?.data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setSnackbar({
          open: true,
          severity: "error",
          message: "Failed to fetch users",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      const res = await API.delete(`/auth/user/${id}`);
      // Expecting { success, message }
      if (res?.data?.success) {
        // update local state after server confirmed deletion
        setData((prev) => prev.filter((u) => u._id !== id));
        setSnackbar({
          open: true,
          severity: "success",
          message: res.data.message || "Deleted",
        });
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: res?.data?.message || "Delete failed",
        });
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to delete user",
      });
    }
  };

  return (
    <DashboardCard title="User List">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={600}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Email</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Role</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography>Loading…</Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography>No users found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Typography fontWeight={600}>{item.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: "4px",
                        backgroundColor:
                          item.role === "superadmin"
                            ? "#4caf50"
                            : item.role === "admin"
                              ? "#2196f3"
                              : "#9e9e9e",
                        color: "#fff",
                      }}
                      size="small"
                      label={item.role}
                    ></Chip>
                  </TableCell>
                  <TableCell>

                    <Tooltip title="Delete user">

                      <IconButton
                        disabled={item.role === "superadmin"}
                        onClick={() => handleDelete(item._id)}
                        size="small"
                        aria-label={`delete-${item._id}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardCard>
  );
}
