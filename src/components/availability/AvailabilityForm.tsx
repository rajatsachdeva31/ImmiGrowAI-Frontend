import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AvailabilityFormProps {
  initialData?: { id: string; startTime: string; endTime: string };
  refreshSlots: () => void;
  onClose: () => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  initialData,
  refreshSlots,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  // **UseEffect to load initial data properly when editing**
  useEffect(() => {
    if (initialData) {
      setFormData({
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
      });
    }
  }, [initialData]); // ✅ Triggers when initialData changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startTime || !formData.endTime) {
      setError("Both start time and end time are required.");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (start >= end) {
      setError("Start time must be before end time.");
      return;
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60); // Duration in minutes

    if (duration > 60) {
      setError("Slots cannot be longer than 1 hour.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const url = initialData
        ? `${endpoint}api/protected/availability/update/${initialData.id}`
        : `${endpoint}api/protected/availability/add`;
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime: formData.startTime,
          endTime: formData.endTime,
          status: "Available",
        }),
      });

      if (!response.ok) throw new Error("Failed to save availability");

      refreshSlots(); // Refresh the slots list
      onClose(); // Close form
    } catch (error) {
      setError("Error saving availability. Please try again." + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg mb-4 ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {initialData ? "Edit Availability" : "Add Availability"}
      </h2>

      {error && <p className="text-red-500  p-2 rounded mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-between">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500"
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Update" : "Submit"}
          </Button>
          <Button
            className="bg-gray-400 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityForm;
