const BASE_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("accessToken");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const firstFieldError = data.errors?.[0]?.msg;
    throw new Error(firstFieldError || data.message || "Something went wrong");
  }
  return data;
}

async function requestFormData(path, formData) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    const firstFieldError = data.errors?.[0]?.msg;
    throw new Error(firstFieldError || data.message || "Something went wrong");
  }
  return data;
}

// --- Auth ---
export function signup({ firstName, lastName, email, password, confirmPassword, role }) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
      Role: role,
    }),
  });
}

export async function login({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ Email: email, Password: password }),
  });
  localStorage.setItem("accessToken", data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
}

export function isLoggedIn() {
  return !!getToken();
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.user_id?.id,
      firstName: payload.user_id?.first_name,
      lastName: payload.user_id?.last_name,
      email: payload.user_id?.email,
      role: payload.user_id?.role,
    };
  } catch {
    return null;
  }
}

// --- Jobs ---
export function getAvailableJobs({ search, location } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (location) params.append("location", location);
  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/jobs/${query}`);
}

export function getJob(id) {
  return request(`/jobs/${id}`);
}

export function getMyJobs() {
  return request("/jobs/recruiter/my");
}

export function createJob({ title, description, location, company }) {
  return request("/jobs/recruiter/createjobs", {
    method: "POST",
    body: JSON.stringify({ title, description, location, company }),
  });
}

export function updateJob(id, { title, description, location, company }) {
  return request(`/jobs/recruiter/${id}/updatejob`, {
    method: "PUT",
    body: JSON.stringify({ title, description, location, company }),
  });
}

export function deleteJob(id) {
  return request(`/jobs/recruiter/${id}/deletejob`, {
    method: "DELETE",
  });
}

// --- Applications ---
export function applyToJob(jobId, { coverLetter, linkedinUrl, phone, resumeFile }) {
  const formData = new FormData();
  formData.append("coverLetter", coverLetter);
  formData.append("linkedinUrl", linkedinUrl);
  formData.append("phone", phone);
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }
  return requestFormData(`/applications/${jobId}/apply`, formData);
}

export function getMyApplications() {
  return request("/applications/mine");
}

export function getJobApplicants(jobId) {
  return request(`/applications/job/${jobId}`);
}

export function updateApplicationStatus(applicationId, status) {
  return request(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// --- Saved Jobs ---
export function saveJob(jobId) {
  return request(`/saved-jobs/${jobId}`, { method: "POST" });
}

export function unsaveJob(jobId) {
  return request(`/saved-jobs/${jobId}`, { method: "DELETE" });
}

export function getSavedJobs() {
  return request("/saved-jobs/");
}

export function updateProfile({ firstName, lastName }) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({ firstName, lastName }),
  });
}

// --- Admin ---
export function getAdminStats() {
  return request("/admin/stats");
}

export function getAdminUsers() {
  return request("/admin/users");
}

export function deleteAdminUser(id) {
  return request(`/admin/users/${id}`, { method: "DELETE" });
}

export function getAdminJobs() {
  return request("/admin/jobs");
}

export function deleteAdminJob(id) {
  return request(`/admin/jobs/${id}`, { method: "DELETE" });
}