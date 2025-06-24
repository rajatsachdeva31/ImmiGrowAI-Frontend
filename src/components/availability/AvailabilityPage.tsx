import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus, CalendarClock, Clock } from "lucide-react";
import AvailabilityForm from "./AvailabilityForm";

interface Availability {
  id: string;
  startTime: string;
  endTime: string;
}

const AvailabilityPage: React.FC = () => {
  const [slots, setSlots] = useState<Availability[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editSlot, setEditSlot] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  const fetchSlots = async () => {
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
      const response = await fetch(
        `${endpoint}api/protected/availability/byId`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch slots");

      const data: Availability[] = await response.json();

      if (data.length == 0) {
        setSlots([]);
      } else {
        setSlots(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      const tokenResponse = await fetch(`${endpoint}auth/token`, {
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
      const response = await fetch(
        `${endpoint}api/protected/availability/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete");

      setSlots(slots.filter((slot) => slot.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  const formatToDateTimeLocal = (utcDate: string) => {
    if (!utcDate) return "";

    const date = new Date(utcDate);

    // Get user's local time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Format: "YYYY-MM-DDTHH:MM"
  };

  const handleEdit = (slot: Availability) => {
    const slotLocal = { ...slot };
    slotLocal.startTime = formatToDateTimeLocal(slot.startTime);
    slotLocal.endTime = formatToDateTimeLocal(slot.endTime);

    setEditSlot(slotLocal);
    setShowForm(true);
  };

  return (
    <div className=" mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-6 mt-4">Availability Slots</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-500 flex items-center px-4 py-2 text-white font-medium rounded-lg shadow-md"
          onClick={() => {
            setShowForm(true);
            setEditSlot(null);
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> Add Slots
        </Button>
      </div>

      {showForm && (
        <AvailabilityForm
          initialData={editSlot}
          refreshSlots={fetchSlots}
          onClose={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-500 text-center">No slots added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="p-5 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-2">
                <CalendarClock className="w-6 h-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Availability Slot
                </h3>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-3 flex flex-col">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-900 font-semibold">Start:</p>
                  <p className="text-gray-700">
                    {slot.startTime
                      ? new Date(slot.startTime).toLocaleString()
                      : "Invalid Date"}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <p className="text-gray-900 font-semibold">End:</p>
                  <p className="text-gray-700">
                    {" "}
                    {slot.endTime
                      ? new Date(slot.endTime).toLocaleString()
                      : "Invalid Date"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-full text-sm">
                  ✅ Available
                </span>
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-500 hover:bg-blue-400 p-2 rounded-lg"
                    size="icon"
                    onClick={() => handleEdit(slot)}
                  >
                    <Pencil className="w-5 h-5 text-white" />
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-400 p-2 rounded-lg"
                    size="icon"
                    onClick={() => handleDelete(slot.id)}
                  >
                    <Trash className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;
