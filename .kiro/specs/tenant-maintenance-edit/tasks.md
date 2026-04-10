# Implementation Plan: Tenant Maintenance Edit

## Overview

Add inline editing to tenant maintenance request history cards. Tenants can edit `title`, `category`, and `description` of a `Pending` request. The implementation spans the backend service, controller, route, and the frontend API helper and `Maintenance.jsx` component.

## Tasks

- [x] 1. Update `getTenantMaintenance` to include `description` in its response
  - In `backend/services/userMaintenanceService.js`, add `description: item.description` to the mapped object returned by `getTenantMaintenance`
  - This ensures the frontend can pre-populate the Edit_Form with the current description value
  - _Requirements: 2.2_

- [x] 2. Add `editMaintenance` service function
  - [x] 2.1 Implement `editMaintenance(userId, maintenanceId, data)` in `backend/services/userMaintenanceService.js`
    - Validate `title` is a non-empty string after trimming; throw if not
    - Validate `category` is one of the four allowed ENUM values; throw `"Invalid category"` if not
    - `findOne({ where: { ID: maintenanceId, userId } })`; throw `"Maintenance request not found"` if missing
    - Check `status === "Pending"`; throw `"Only pending requests can be edited"` if not
    - `UPDATE` `title`, `category`, `description` on the record
    - Call `createNotification` for `role: "admin"` with `type: "maintenance update"`, `title: "Maintenance Request Edited"`, and a message referencing the updated request title
    - Call `createNotification` for `role: "caretaker"` with the same fields
    - Call `createActivityLog` with `action: "EDIT MAINTENANCE"`, `role: "tenant"`, `userId`, a description referencing the updated title, `referenceId: request.ID`, `referenceType: "maintenance"`
    - Return `{ id, title, category, description, status, requestedDate }`
    - _Requirements: 3.1, 3.2, 4.2, 4.3, 5.1, 5.2, 6.1, 6.2_

  - [ ]* 2.2 Write property test for `editMaintenance` — Property 6: Category validation
    - **Property 6: Category validation accepts only the four allowed values**
    - Use fast-check to generate arbitrary strings; assert service throws for any value outside `["Electrical Maintenance", "Water Interruptions", "Floor Renovation", "Other"]`
    - **Validates: Requirements 3.2**

  - [ ]* 2.3 Write property test for `editMaintenance` — Property 7: Backend authorization
    - **Property 7: Backend only edits requests owned by the tenant and in Pending status**
    - Use fast-check to generate `(userId, requestUserId, status)` triples; assert update is applied only when `userId === requestUserId && status === "Pending"`, and returns 403/400 otherwise
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [ ]* 2.4 Write property test for `editMaintenance` — Property 8: Notifications
    - **Property 8: Successful edit notifies both admin and caretaker**
    - Use fast-check to generate valid edit payloads; assert `createNotification` is called exactly once for `role="admin"` and once for `role="caretaker"` with correct `type`, `title`, and message
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 2.5 Write property test for `editMaintenance` — Property 10: Activity log
    - **Property 10: Successful edit creates a complete activity log entry**
    - Use fast-check to generate valid edit payloads; assert `createActivityLog` is called with `action="EDIT MAINTENANCE"`, `role="tenant"`, correct `userId`, a description containing the updated title, `referenceId` equal to the record's `ID`, and `referenceType="maintenance"`
    - **Validates: Requirements 6.1, 6.2**

- [x] 3. Add `editMaintenanceRequest` controller and PATCH route
  - [x] 3.1 Implement `editMaintenanceRequest(req, res)` in `backend/controllers/userMaintenanceController.js`
    - Call `editMaintenance(req.auth.id, req.params.id, req.body)`
    - On success: call `emitEvent(req, "maintenance_updated")`, emit `new_notification` to `io.to("admin")` and `io.to("caretaker")`, return `200 { success: true, request: result }`
    - On ownership failure (message contains "not found"): return `400`; add a separate catch branch for `403` if needed (ownership is enforced in service by `findOne` with `userId`)
    - On status/validation error: return `400 { success: false, message: error.message }`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.3_

  - [x] 3.2 Register `PATCH /:id` route in `backend/routes/userMaintenanceRoutes.js`
    - Import `editMaintenanceRequest` from the controller
    - Add `router.patch("/:id", authenticate, authorize("tenant"), editMaintenanceRequest)` — place it before the `/:id/followup` route to avoid conflicts
    - _Requirements: 4.1_

  - [ ]* 3.3 Write property test for controller — Property 9: Socket emission
    - **Property 9: Successful edit emits the `maintenance_updated` socket event**
    - Use fast-check to generate valid edit payloads; mock `editMaintenance` to resolve; assert `emitEvent` is called with `"maintenance_updated"`
    - **Validates: Requirements 5.3**

- [x] 4. Checkpoint — Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Add `editMaintenanceRequest` API helper to the frontend
  - In `frontend/src/api/tenantAPI/maintenanceAPI.js`, add:
    ```js
    export const editMaintenanceRequest = async (id, payload) => {
      const response = await api.patch(`${BASE_URL}/${id}`, payload);
      return response.data;
    };
    ```
  - _Requirements: 4.1_

- [x] 6. Add edit state variables and edit logic to `Maintenance.jsx`
  - [x] 6.1 Add the four new state variables at the top of `MaintenanceCards`
    - `editingId` (`number | null`, init `null`) — ID of the card currently in edit mode
    - `editDraft` (`{ category, title, description }`, init `{}`) — working copy of fields being edited
    - `editError` (`string | null`, init `null`) — inline validation/server error message
    - `isSaving` (`boolean`, init `false`) — disables Save button during PATCH
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 6.2 Implement `handleEditOpen(item)` and `handleEditCancel()` handlers
    - `handleEditOpen(item)`: set `editingId` to `item.id`, set `editDraft` to `{ category: item.category, title: item.title, description: item.description ?? "" }`, clear `editError`
    - `handleEditCancel()`: set `editingId` to `null`, clear `editDraft` and `editError`
    - Opening a new card's form automatically closes any previously open form because `editingId` is replaced (single-edit-mode invariant)
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 6.3 Implement `handleEditSave()` handler
    - Client-side: if `editDraft.title.trim() === ""`, set `editError` to a validation message and return without calling the API
    - Set `isSaving` to `true`, clear `editError`
    - Call `editMaintenanceRequest(editingId, editDraft)`
    - On success: set `editingId` to `null`, call `loadMaintenanceHistory(true)`
    - On error: set `editError` to `error.response?.data?.message` or a generic message; keep form open
    - Always set `isSaving` to `false` in finally
    - _Requirements: 3.1, 3.3, 4.1, 4.5, 4.6_

  - [ ]* 6.4 Write property test — Property 1: Edit button visibility
    - **Property 1: Edit button visibility is determined by status**
    - Use fast-check to generate random `status` values from the full enum; render a History_Card stub; assert edit button is present iff `status === "Pending"`
    - **Validates: Requirements 1.1, 1.2**

  - [ ]* 6.5 Write property test — Property 2: Edit form pre-populates with current request values
    - **Property 2: Edit form pre-populates with current request values**
    - Use fast-check to generate random `{ category, title, description }` objects; simulate `handleEditOpen`; assert each `editDraft` field equals the corresponding request value
    - **Validates: Requirements 2.2**

  - [ ]* 6.6 Write property test — Property 3: Cancel reverts to original read-only display
    - **Property 3: Cancel reverts to original read-only display**
    - Use fast-check to generate random requests and random draft edits; simulate `handleEditOpen` then mutations to `editDraft` then `handleEditCancel`; assert `editingId` is `null` and displayed values equal original request values
    - **Validates: Requirements 2.4**

  - [ ]* 6.7 Write property test — Property 4: Only one card in edit mode at a time
    - **Property 4: Only one card may be in edit mode at a time**
    - Use fast-check to generate a list of ≥2 Pending requests; simulate opening card N's form after card M's; assert `editingId` equals only the last opened card's ID
    - **Validates: Requirements 2.5**

  - [ ]* 6.8 Write property test — Property 5: Title validation rejects empty and whitespace-only strings
    - **Property 5: Title validation rejects empty and whitespace-only strings**
    - Use fast-check to generate arbitrary whitespace strings (empty, spaces, tabs, newlines); call `handleEditSave` with those as `editDraft.title`; assert no API call is made and `editError` is non-null
    - **Validates: Requirements 3.1, 3.3**

- [x] 7. Render the Edit button and inline Edit_Form inside each History_Card in `Maintenance.jsx`
  - [x] 7.1 Add the Edit button to each History_Card
    - Render the edit button only when `item.status === "Pending"` (satisfies Requirement 1.1 and 1.2)
    - Place it alongside the existing Follow Up button in the right-side action area
    - Button label: "Edit"; style consistently with the existing design system (use `bg-[#f7b094] text-[#330101]` active style)
    - `onClick`: call `handleEditOpen(item)`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 7.2 Render the inline Edit_Form below the card content when `editingId === item.id`
    - `<select>` bound to `editDraft.category` using the existing `CATEGORIES` array
    - `<input type="text">` bound to `editDraft.title` (required)
    - `<textarea>` bound to `editDraft.description` (optional)
    - Save button: calls `handleEditSave`, disabled when `isSaving`; label toggles to "Saving..." while `isSaving`
    - Cancel button: calls `handleEditCancel`
    - If `editError` is non-null, render it as an inline error message below the fields
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.3, 3.4_

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) with a minimum of 100 iterations each
- The `PATCH /:id` route must be registered before `/:id/followup` in the router to avoid Express matching conflicts
- The `description` field is `allowNull: false` in the Sequelize model; pass `""` when the tenant submits an empty description
