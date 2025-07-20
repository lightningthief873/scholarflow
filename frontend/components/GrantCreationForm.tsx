import React, { useState } from "react";
import { Button } from "@radix-ui/themes";
import { DEMOGRAPHICS, EDUCATION_LEVELS } from "../src/constants";
import { useScholarFlow } from "../hooks/useScholarFlow";

interface GrantCreationFormProps {
  onGrantCreated: () => void;
  onCancel: () => void;
}

export function GrantCreationForm({
  onGrantCreated,
  onCancel,
}: GrantCreationFormProps) {
  const { createGrant, loading, error } = useScholarFlow();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalFunding: "",
    targetDemographic: "",
    targetEducationLevel: "",
    maxGrantPerStudent: "",
    applicationDeadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.totalFunding ||
      !formData.targetDemographic ||
      !formData.targetEducationLevel ||
      !formData.maxGrantPerStudent ||
      !formData.applicationDeadline
    ) {
      alert("Please fill in all fields");
      return;
    }

    const totalFunding = parseFloat(formData.totalFunding);
    const maxPerStudent = parseFloat(formData.maxGrantPerStudent);
    const deadline = new Date(formData.applicationDeadline).getTime();

    if (totalFunding <= 0 || maxPerStudent <= 0) {
      alert("Funding amounts must be greater than 0");
      return;
    }

    if (maxPerStudent > totalFunding) {
      alert("Max grant per student cannot exceed total funding");
      return;
    }

    if (deadline <= Date.now()) {
      alert("Application deadline must be in the future");
      return;
    }

    try {
      await createGrant(
        formData.title,
        formData.description,
        totalFunding,
        formData.targetDemographic,
        formData.targetEducationLevel,
        maxPerStudent,
        deadline,
      );
      onGrantCreated();
    } catch (err) {
      console.error("Grant creation failed:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Grant</h2>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Grant Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., STEM Education Grant"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the purpose and goals of this grant..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Funding ($)
            </label>
            <input
              type="number"
              value={formData.totalFunding}
              onChange={(e) =>
                handleInputChange("totalFunding", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Grant per Student ($)
            </label>
            <input
              type="number"
              value={formData.maxGrantPerStudent}
              onChange={(e) =>
                handleInputChange("maxGrantPerStudent", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2500"
              min="1"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Demographic
            </label>
            <select
              value={formData.targetDemographic}
              onChange={(e) =>
                handleInputChange("targetDemographic", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select demographic</option>
              {DEMOGRAPHICS.map((demo) => (
                <option key={demo} value={demo}>
                  {demo.charAt(0).toUpperCase() +
                    demo.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Education Level
            </label>
            <select
              value={formData.targetEducationLevel}
              onChange={(e) =>
                handleInputChange("targetEducationLevel", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select education level</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() +
                    level.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Application Deadline
          </label>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) =>
              handleInputChange("applicationDeadline", e.target.value)
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={minDate}
            required
          />
        </div>

        <div className="bg-blue-900 border border-blue-700 text-blue-100 px-4 py-3 rounded">
          <h4 className="font-semibold mb-2">Grant Creation Notes:</h4>
          <ul className="text-sm space-y-1">
            <li>• Grants are funded from your connected wallet</li>
            <li>• Students matching your criteria can apply</li>
            <li>• You can approve/reject applications manually</li>
            <li>• Approved funds are transferred to student wallets</li>
            <li>• Students can only spend on verified educational items</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Creating Grant..." : "Create Grant"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
