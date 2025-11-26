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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "../../components/shared/DashboardCard";
import { API } from "../../api";

export default function EnquiryList() {
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
        const res = await API.get("/form");
        // backend returns { success, message, data }
        if (mounted) setData(res?.data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
        setSnackbar({
          open: true,
          severity: "error",
          message: "Failed to fetch forms",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this form?");
    if (!ok) return;

    try {
      const res = await API.delete(`/form/${id}`);
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
      console.error("Failed to delete form:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to delete form",
      });
    }
  };

  return (
    <DashboardCard title="Enquiry List">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table aria-label="enquiry table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={600}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Email</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Phone</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Message</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography>Loading…</Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography>No enquiries found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Typography fontWeight={600}>{item.name ?? "-"}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography>{item.email ?? "-"}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography>{item.phone ?? "-"}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography>
                      {item.date
                        ? (() => {
                          const d = new Date(item.date);
                          return isNaN(d.getTime())
                            ? "-"
                            : d.toLocaleDateString();
                        })()
                        : "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography>{item.message ?? "-"}</Typography>
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Delete Form">
                      <IconButton
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
