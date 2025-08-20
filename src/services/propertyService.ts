import type { Property } from "@/store/propertyStore";
import { loadDemoProperties } from "@/data/demoProperties";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API client with common configuration
const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Get token from localStorage (if implementing auth)
    const token = localStorage.getItem("authToken");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  },

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  },
};

// Property service methods
export const propertyService = {
  // Get all properties for the authenticated user
  async getProperties(): Promise<Property[]> {
    try {
      const response = await apiClient.get<{ properties: Property[] }>(
        "/properties"
      );
      return response.properties;
    } catch (error) {
      // Fallback to demo data if API is not available
      console.warn("API not available, using demo data:", error);
      return await loadDemoProperties();
    }
  },

  // Get a single property by ID
  async getProperty(id: string): Promise<Property> {
    const response = await apiClient.get<{ property: Property }>(
      `/properties/${id}`
    );
    return response.property;
  },

  // Create a new property
  async createProperty(
    propertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "userId">
  ): Promise<Property> {
    const response = await apiClient.post<{ property: Property }>(
      "/properties",
      propertyData
    );
    return response.property;
  },

  // Update an existing property
  async updateProperty(
    id: string,
    propertyData: Partial<Property>
  ): Promise<Property> {
    const response = await apiClient.put<{ property: Property }>(
      `/properties/${id}`,
      propertyData
    );
    return response.property;
  },

  // Delete a property
  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  },

  // Upload property images
  async uploadPropertyImages(propertyId: string, files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    await fetch(`${API_BASE_URL}/properties/${propertyId}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    });
  },
};

export default propertyService;
