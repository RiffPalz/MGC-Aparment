# Requirements Document

## Introduction

Tenants can currently submit maintenance requests, but once submitted there is no way to edit them from the request history. This feature adds inline editing to the request history cards, allowing tenants to update the title, description, and category of a maintenance request while it is in **Pending** status. Requests in any other status (Approved, In Progress, Done) remain read-only. When a tenant saves an edit, the system notifies admin and caretaker of the change.

## Glossary

- **Maintenance_Request**: A record in the `maintenance_requests` table representing a tenant-reported concern, with fields: `ID`, `userId`, `category`, `title`, `description`, `status`, `followedUp`, `startDate`, `endDate`.
- **Tenant**: An authenticated user with role `"tenant"` who owns the maintenance request.
- **Edit_Form**: The inline expanded section within a history card that exposes editable fields for a Pending request.
- **History_Card**: A UI card in the Request History panel representing a single maintenance request.
- **Status**: The current lifecycle stage of a Maintenance_Request — one of: `Pending`, `Approved`, `In Progress`, `Done`.
- **Notification_Service**: The backend service responsible for creating in-app notifications for admin and caretaker roles.
- **Activity_Log**: A record of a user action stored via the activity log service.

---

## Requirements

### Requirement 1: Edit Button Visibility on History Cards

**User Story:** As a tenant, I want to see an edit button only on my Pending requests, so that I know which requests I can still modify.

#### Acceptance Criteria

1. WHEN a History_Card is rendered and the Maintenance_Request status is `"Pending"`, THE History_Card SHALL display an edit button.
2. WHEN a History_Card is rendered and the Maintenance_Request status is `"Approved"`, `"In Progress"`, or `"Done"`, THE History_Card SHALL NOT display an edit button.
3. THE edit button SHALL be visually distinct and labeled to clearly indicate an edit action.

---

### Requirement 2: Inline Edit Form Expansion

**User Story:** As a tenant, I want to expand a Pending request card to edit it inline, so that I can update my request without leaving the page.

#### Acceptance Criteria

1. WHEN a tenant clicks the edit button on a Pending History_Card, THE History_Card SHALL expand to reveal the Edit_Form in place.
2. THE Edit_Form SHALL pre-populate the `category`, `title`, and `description` fields with the current values of the Maintenance_Request.
3. WHEN the Edit_Form is open, THE Edit_Form SHALL display a Save button and a Cancel button.
4. WHEN a tenant clicks the Cancel button, THE Edit_Form SHALL collapse and the History_Card SHALL revert to its original read-only display without saving any changes.
5. THE Edit_Form SHALL allow only one History_Card to be in edit mode at a time; WHEN a tenant opens an Edit_Form on one card, THE History_Card previously in edit mode SHALL collapse and discard unsaved changes.

---

### Requirement 3: Edit Form Field Validation

**User Story:** As a tenant, I want the edit form to validate my input before saving, so that I cannot submit an incomplete or invalid request.

#### Acceptance Criteria

1. THE Edit_Form SHALL require the `title` field to be non-empty before allowing submission.
2. THE Edit_Form SHALL require the `category` field to have a valid value from the allowed category list: `"Electrical Maintenance"`, `"Water Interruptions"`, `"Floor Renovation"`, `"Other"`.
3. IF the tenant attempts to save with an empty `title`, THEN THE Edit_Form SHALL display an inline validation error and SHALL NOT submit the request.
4. THE `description` field SHALL be optional and may be submitted as an empty string.

---

### Requirement 4: Save Edited Maintenance Request

**User Story:** As a tenant, I want to save my edits to a Pending request, so that the updated information is reflected in the system.

#### Acceptance Criteria

1. WHEN a tenant submits the Edit_Form with valid data, THE Maintenance_System SHALL send a PATCH request to the backend with the updated `category`, `title`, and `description`.
2. THE backend SHALL only process the edit if the Maintenance_Request belongs to the authenticated Tenant and its status is `"Pending"`.
3. IF the Maintenance_Request status is not `"Pending"`, THEN THE Maintenance_System SHALL return an error and THE Edit_Form SHALL display an error message.
4. IF the Maintenance_Request does not belong to the authenticated Tenant, THEN THE Maintenance_System SHALL return a 403 error.
5. WHEN the edit is saved successfully, THE History_Card SHALL collapse the Edit_Form and display the updated values in read-only mode.
6. WHEN the edit is saved successfully, THE Maintenance_System SHALL reload the request history to reflect the latest data.

---

### Requirement 5: Notifications on Edit

**User Story:** As an admin or caretaker, I want to be notified when a tenant edits a Pending maintenance request, so that I am aware of updated information before acting on it.

#### Acceptance Criteria

1. WHEN a Maintenance_Request is successfully edited by a Tenant, THE Notification_Service SHALL create an in-app notification for the `admin` role with type `"maintenance update"`, title `"Maintenance Request Edited"`, and a message referencing the request title.
2. WHEN a Maintenance_Request is successfully edited by a Tenant, THE Notification_Service SHALL create an in-app notification for the `caretaker` role with the same type, title, and message.
3. WHEN a Maintenance_Request is successfully edited by a Tenant, THE Maintenance_System SHALL emit a `maintenance_updated` socket event so that connected admin and caretaker clients refresh their views.

---

### Requirement 6: Activity Logging on Edit

**User Story:** As a tenant, I want my edit action to be recorded in the activity log, so that there is a traceable history of changes I made.

#### Acceptance Criteria

1. WHEN a Maintenance_Request is successfully edited, THE Activity_Log SHALL record an entry with action `"EDIT MAINTENANCE"`, the tenant's `userId`, role `"tenant"`, and a description referencing the updated request title.
2. THE Activity_Log entry SHALL include the `referenceId` of the edited Maintenance_Request and `referenceType` of `"maintenance"`.
