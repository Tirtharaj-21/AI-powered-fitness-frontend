import { useCallback, useEffect, useState } from "react";
import { getActivities } from "../api";
import ActivityForm from "./ActivityForm";
import ActivityList from "./ActivityList";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  const loadActivities = useCallback(async () => {
    try {
      const res = await getActivities();
      setActivities(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <>
      <ActivityForm onSuccess={loadActivities} />
      <div className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <ActivityList activities={activities} />
      </div>
    </>
  );
}
