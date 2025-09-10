-- Create enums
CREATE TYPE "gender_enum" AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE "status_enum" AS ENUM ('Active', 'Inactive', 'Former Member');
CREATE TYPE "meeting_type_enum" AS ENUM ('การประชุมสภา', 'การประชุมพรรค', 'การประชุมกรรมาธิการ');
CREATE TYPE "meeting_session_enum" AS ENUM ('การประชุมสามัญ', 'การประชุมวิสามัญ');
CREATE TYPE "vote_type_enum" AS ENUM ('Aye', 'Nay', 'Abstain', 'Absent', 'Leave');

-- Create tables
CREATE TABLE "locations" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "members" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "age" INT,
    "gender" gender_enum,
    "location" TEXT REFERENCES locations(name),
    "education" TEXT,
    "professional_background" TEXT,
    "contact" TEXT,
    "roles" TEXT[],
    "status" status_enum,
    "activity_log" TEXT,
    "volunteer_work" TEXT,
    "electoral_history" TEXT,
    "parliamentary_roles" TEXT,
    "voting_record" TEXT,
    "key_policy_interests" TEXT
);

CREATE TABLE "committees" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "member_committees" (
    "member_id" TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    "committee_id" INT NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, committee_id)
);

CREATE TABLE "meetings" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "presiding_officer" TEXT,
    "location" TEXT REFERENCES locations(name),
    "meeting_type" meeting_type_enum,
    "meeting_session" meeting_session_enum,
    "meeting_number" TEXT,
    "committee_name" TEXT,
    "related_documents" JSONB,
    "attendees" TEXT[]
);

CREATE TABLE "motion_topics" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "motions" (
    "id" TEXT PRIMARY KEY,
    "meeting_id" TEXT REFERENCES meetings(id) ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_party_sponsored" BOOLEAN,
    "topic" TEXT,
    "sponsor_id" TEXT REFERENCES members(id),
    "total_parliament_aye" INT,
    "total_parliament_nay" INT,
    "total_parliament_abstain" INT
);

CREATE TABLE "votes" (
    "id" TEXT PRIMARY KEY,
    "motion_id" TEXT REFERENCES motions(id) ON DELETE CASCADE,
    "member_id" TEXT REFERENCES members(id) ON DELETE CASCADE,
    "vote" vote_type_enum
);

CREATE TABLE "roles" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "permissions" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "role_permissions" (
    "role_id" TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    "permission_id" TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE "system_logs" (
    "id" TEXT PRIMARY KEY,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT
);

-- Seed initial data
INSERT INTO "locations" ("name") VALUES ('ท่าพระจันทร์'), ('รังสิต'), ('ลำปาง'), ('ส่วนกลาง');
INSERT INTO "motion_topics" ("name") VALUES ('Economy'), ('Social'), ('Security'), ('Foreign Affairs'), ('Education'), ('Environment');
INSERT INTO "committees" ("name") VALUES ('Finance'), ('Outreach'), ('Judiciary'), ('Economic Affairs'), ('Culture'), ('Strategy');

INSERT INTO "roles" ("id", "name") VALUES 
('role-1', 'Admin'),
('role-2', 'HR Manager'),
('role-3', 'Meeting Secretary'),
('role-4', 'Data Analyst'),
('role-5', 'Member');

INSERT INTO "permissions" ("id", "name") VALUES 
('perm-1', 'Create Party Member'),
('perm-2', 'Edit MP Profile'),
('perm-3', 'View Analytics Dashboard'),
('perm-4', 'Manage Meetings'),
('perm-5', 'Record Votes'),
('perm-6', 'Admin Access');

INSERT INTO "role_permissions" ("role_id", "permission_id") VALUES
('role-1', 'perm-1'),
('role-1', 'perm-2'),
('role-1', 'perm-3'),
('role-1', 'perm-4'),
('role-1', 'perm-5'),
('role-1', 'perm-6'),
('role-2', 'perm-1'),
('role-2', 'perm-2'),
('role-3', 'perm-4'),
('role-3', 'perm-5'),
('role-4', 'perm-3');

INSERT INTO "system_logs" ("id", "timestamp", "user", "action", "details") VALUES
('log-1', '2024-08-01 10:00:00+07', 'Alice Johnson', 'Login', 'Successful login from IP 192.168.1.1'),
('log-2', '2024-08-01 10:05:23+07', 'Alice Johnson', 'Edit Meeting', 'Edited meeting "Q3 Budget Committee Session"'),
('log-3', '2024-08-01 10:15:00+07', 'George Orwell', 'Record Vote', 'Recorded votes for motion "Approve allocation for infrastructure projects"'),
('log-4', '2024-08-01 11:30:10+07', 'Fiona Gallagher', 'Create Meeting', 'Created new meeting "Emergency Press Briefing"'),
('log-5', '2024-08-01 12:00:00+07', 'System', 'Security Alert', 'Multiple failed login attempts for user "charlie.b@example.com"'),
('log-6', '2024-08-01 14:00:45+07', 'Alice Johnson', 'Edit Role', 'Updated permissions for role "Data Analyst"');
