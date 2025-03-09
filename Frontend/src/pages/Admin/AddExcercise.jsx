import { useState } from "react";

const ExerciseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    muscle_group: "",
    difficulty_level: "Beginner",
    instructions: "",
    equipment: "Bodyweight",
    duration: "",
    burned_calories: "",
    image: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call (replace with actual API call)
    setTimeout(() => {
      console.log("Exercise Data Submitted:", formData);
      setLoading(false);
      if (onSubmit) onSubmit(formData);
    }, 2000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Exercise</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exercise Name */}
        <input
          type="text"
          name="name"
          placeholder="Exercise Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Muscle Group */}
        <input
          type="text"
          name="muscle_group"
          placeholder="Muscle Group (e.g., Chest, Back)"
          value={formData.muscle_group}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Difficulty Level */}
        <select
          name="difficulty_level"
          value={formData.difficulty_level}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* Instructions */}
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Equipment */}
        <input
          type="text"
          name="equipment"
          placeholder="Equipment (e.g., Dumbbells, Bodyweight)"
          value={formData.equipment}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Duration & Calories */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 5 min)"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="burned_calories"
            placeholder="Burned Calories"
            value={formData.burned_calories}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        {/* Video Upload */}
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Exercise"}
        </button>
      </form>
    </div>
  );
};

export default ExerciseForm;
