import { useState, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { addActivity } from "../api";

// Must match your Java ActivityType enum exactly
const ACTIVITY_TYPES = [
  "RUNNING",
  "WALKING",
  "CYCLING",
  "SWIMMING",
  "YOGA",
  "WEIGHT_TRAINING",
  "CARDIO",
];

const emptyForm = {
  type: "RUNNING",
  duration: "",
  caloriesBurned: "",
  startTime: "",
};

export default function ActivityForm({ onSuccess }) {
  const { tokenData } = useContext(AuthContext);

  const [form, setForm] = useState(emptyForm);
  const [metrics, setMetrics] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMetricChange = (index, field, value) => {
    const updated = metrics.map((m, i) =>
      i === index ? { ...m, [field]: value } : m,
    );
    setMetrics(updated);
  };

  const addMetric = () => setMetrics([...metrics, { key: "", value: "" }]);

  const removeMetric = (index) =>
    setMetrics(metrics.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const additionalMetrics = {};
    metrics.forEach(({ key, value }) => {
      if (key.trim() && value !== "") {
        additionalMetrics[key.trim()] = isNaN(value) ? value : Number(value);
      }
    });

    const payload = {
      userID: tokenData?.sub,
      type: form.type,
      duration: Number(form.duration),
      caloriesBurned: Number(form.caloriesBurned),
      startTime: new Date(form.startTime).toISOString(),
      additionalMetrics,
    };

    try {
      setLoading(true);
      await addActivity(payload); // POST http://localhost:8085/api/activities

      setSuccess("Activity saved successfully!");
      setForm(emptyForm);
      setMetrics([{ key: "", value: "" }]);
      onSuccess?.(); // parent reloads the list
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card border-0 shadow overflow-hidden"
      style={{ borderRadius: 16 }}
    >
      <div className="row g-0">
        {/* Image panel */}
        <div className="col-lg-5 d-none d-lg-flex activity-hero text-white align-items-end p-5">
          <div>
            <h2 className="fw-bold mb-2">Push your limits.</h2>
            <p className="mb-0 opacity-75">
              Every workout you log brings you closer to your goal.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="col-lg-7 bg-white">
          <div className="p-4 p-md-5">
            <h4 className="fw-bold mb-1">Log Activity</h4>
            <p className="text-muted mb-4">
              Record your workout details below.
            </p>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && (
              <div className="alert alert-success py-2">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Activity Type
                  </label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="caloriesBurned"
                    value={form.caloriesBurned}
                    onChange={handleChange}
                    placeholder="e.g. 250"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">
                    Additional Metrics (optional)
                  </label>
                  {metrics.map((m, i) => (
                    <div className="input-group mb-2" key={i}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name (e.g. distance)"
                        value={m.key}
                        onChange={(e) =>
                          handleMetricChange(i, "key", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Value (e.g. 5)"
                        value={m.value}
                        onChange={(e) =>
                          handleMetricChange(i, "value", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeMetric(i)}
                        disabled={metrics.length === 1}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={addMetric}
                  >
                    <i className="bi bi-plus-lg me-1"></i>Add metric
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Activity"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
