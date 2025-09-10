-- Create the 'locations' enum type
CREATE TYPE "location_enum" AS ENUM ('ท่าพระจันทร์', 'รังสิต', 'ลำปาง', 'ส่วนกลาง');

-- Create the 'gender_enum' type
CREATE TYPE "gender_enum" AS ENUM ('Male', 'Female', 'Other');

-- Create the 'status_enum' type
CREATE TYPE "status_enum" AS ENUM ('Active', 'Inactive', 'Former Member');

-- Create the 'meeting_type_enum' type
CREATE TYPE "meeting_type_enum" AS ENUM ('การประชุมสภา', 'การประชุมพรรค', 'การประชุมกรรมาธิการ');

-- Create the 'meeting_session_enum' type
CREATE TYPE "meeting_session_enum" AS ENUM ('การประชุมสามัญ', 'การประชุมวิสามัญ');

-- Create the 'vote_type_enum' type
CREATE TYPE "vote_type_enum" AS ENUM ('Aye', 'Nay', 'Abstain', 'Absent', 'Leave');

-- Create Members table
CREATE TABLE members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    gender gender_enum,
    location location_enum,
    education TEXT,
    professional_background TEXT,
    activity_log TEXT,
    volunteer_work TEXT,
    contact TEXT,
    roles TEXT[],
    status status_enum,
    electoral_history TEXT,
    parliamentary_roles TEXT,
    voting_record TEXT,
    key_policy_interests TEXT
);

-- Create Committees table
CREATE TABLE committees (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Create Member_Committees join table
CREATE TABLE member_committees (
    member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
    committee_id INTEGER REFERENCES committees(id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, committee_id)
);

-- Create Meetings table
CREATE TABLE meetings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    presiding_officer TEXT,
    location location_enum,
    meeting_type meeting_type_enum,
    meeting_session meeting_session_enum,
    meeting_number TEXT,
    committee_name TEXT,
    related_documents JSONB
);

-- Create meeting_attendees join table
CREATE TABLE meeting_attendees (
    meeting_id TEXT REFERENCES meetings(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
    PRIMARY KEY (meeting_id, member_id)
);


-- Create Motions table
CREATE TABLE motions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_party_sponsored BOOLEAN DEFAULT FALSE,
    topic TEXT,
    sponsor_id TEXT REFERENCES members(id) ON DELETE SET NULL,
    meeting_id TEXT REFERENCES meetings(id) ON DELETE CASCADE,
    total_parliament_aye INTEGER,
    total_parliament_nay INTEGER,
    total_parliament_abstain INTEGER
);

-- Create Votes table
CREATE TABLE votes (
    id TEXT PRIMARY KEY,
    motion_id TEXT REFERENCES motions(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
    vote vote_type_enum,
    UNIQUE(motion_id, member_id)
);

-- Create motion_topics table
CREATE TABLE motion_topics (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Seed initial data
INSERT INTO motion_topics (name) VALUES
('Economy'),
('Social'),
('Security'),
('Foreign Affairs'),
('Education'),
('Environment');

INSERT INTO committees (name) VALUES
('Finance'),
('Outreach'),
('Judiciary'),
('Economic Affairs'),
('Education'),
('Culture'),
('Strategy');


-- You can add seed data for members, meetings etc. here if needed.
-- For example:
INSERT INTO members (id, name, email, age, gender, location, education, professional_background, committee_memberships, activity_log, volunteer_work, contact, roles, status, electoral_history, parliamentary_roles, voting_record, key_policy_interests) VALUES
('mem-1', 'Alice Johnson', 'alice.j@example.com', 34, 'Female', 'ท่าพระจันทร์', 'M.A. Political Science', 'Policy Advisor', '{"Finance", "Outreach"}', 'Active in 5 campaigns', '120 hours', 'alice.j@example.com', '{"Executive"}', 'Active', NULL, NULL, NULL, NULL),
('mem-2', 'Bob Williams', 'bob.w@example.com', 45, 'Male', 'รังสิต', 'B.S. Economics', 'Economist', '{"Economic Affairs"}', 'Organized 3 town halls', '80 hours', 'bob.w@example.com', '{}', 'Active', NULL, NULL, NULL, NULL),
('mem-3', 'Charlie Brown', 'charlie.b@example.com', 28, 'Male', 'ลำปาง', 'J.D.', 'Lawyer', '{"Judiciary"}', 'Attended 20 meetings', '50 hours', 'charlie.b@example.com', '{}', 'Active', NULL, NULL, NULL, NULL),
('mem-4', 'Diana Prince', 'diana.p@example.com', 52, 'Female', 'ท่าพระจันทร์', 'Ph.D. History', 'Professor', '{"Education", "Culture"}', 'Published 2 articles', '200 hours', 'diana.p@example.com', '{}', 'Former Member', NULL, NULL, NULL, NULL),
('mem-5', 'Ethan Hunt', 'ethan.h@example.com', 39, 'Male', 'รังสิต', 'MBA', 'Consultant', '{"Strategy"}', 'Led fundraising drive', '150 hours', 'ethan.h@example.com', '{}', 'Active', NULL, NULL, NULL, NULL),
('mp-1', 'Fiona Gallagher', 'fiona.g@example.com', 48, 'Female', 'ท่าพระจันทร์', 'MPH', 'Public Health Admin', '{}', '', '', 'fiona.g@example.com', '{"MP"}', 'Active', 'Elected 2018, 2022', 'Whip', '95% attendance', 'Healthcare, Social Justice'),
('mp-2', 'George Orwell', 'george.o@example.com', 55, 'Male', 'รังสิต', 'B.A. Journalism', 'Journalist', '{}', '', '', 'george.o@example.com', '{"MP"}', 'Active', 'Elected 2010, 2014, 2018, 2022', 'Committee Chair (Oversight)', '98% attendance', 'Government Transparency, Civil Liberties'),
('mp-3', 'Hannah Abbott', 'hannah.a@example.com', 41, 'Female', 'ลำปาง', 'M.S. Environmental Science', 'Scientist', '{}', '', '', 'hannah.a@example.com', '{"MP"}', 'Active', 'Elected 2022', 'Backbencher', '92% attendance', 'Environmental Protection, Renewable Energy');

INSERT INTO meetings (id, title, date, presiding_officer, location, meeting_type, meeting_session, meeting_number, committee_name, related_documents) VALUES
('meet-1', 'Q3 Budget Committee Session', '2024-07-20', 'George Orwell', 'ท่าพระจันทร์', 'การประชุมสภา', 'การประชุมสามัญ', '1/2567', NULL, '[{"name": "Q3 Budget Proposal.pdf", "url": "#"}]'),
('meet-2', 'Party Policy Debate on Environment', '2024-07-25', 'Fiona Gallagher', 'รังสิต', 'การประชุมพรรค', 'การประชุมวิสามัญ', NULL, NULL, '[]');

INSERT INTO meeting_attendees (meeting_id, member_id) VALUES
('meet-1', 'mp-1'),
('meet-1', 'mp-2'),
('meet-1', 'mem-1'),
('meet-1', 'mem-2'),
('meet-2', 'mp-1'),
('meet-2', 'mp-2'),
('meet-2', 'mp-3'),
('meet-2', 'mem-1'),
('meet-2', 'mem-4');

INSERT INTO motions (id, title, description, is_party_sponsored, topic, sponsor_id, meeting_id, total_parliament_aye, total_parliament_nay, total_parliament_abstain) VALUES
('motion-1', 'Approve allocation for infrastructure projects', 'To approve the proposed budget of $5M for the new bridge construction.', true, 'Economy', 'mp-1', 'meet-1', 150, 100, 5),
('motion-2', 'Review healthcare subsidy proposal', 'Discuss and vote on the new public healthcare subsidy program.', true, 'Social', 'mp-1', 'meet-1', 180, 70, 5),
('motion-3', 'Adopt Carbon Neutrality Goal by 2040', 'Commit the party to a policy of achieving carbon neutrality across the nation by the year 2040.', true, 'Environment', 'mp-3', 'meet-2', NULL, NULL, NULL),
('motion-4', 'Opposition motion on industrial regulations', 'Vote on an opposition party motion to relax industrial emission standards.', false, 'Economy', NULL, 'meet-2', NULL, NULL, NULL);

INSERT INTO votes (id, motion_id, member_id, vote) VALUES
('vote-1', 'motion-1', 'mp-1', 'Aye'),
('vote-2', 'motion-1', 'mp-2', 'Aye'),
('vote-3', 'motion-1', 'mem-1', 'Abstain'),
('vote-4', 'motion-1', 'mem-2', 'Nay'),
('vote-5', 'motion-2', 'mp-1', 'Aye'),
('vote-6', 'motion-2', 'mp-2', 'Nay'),
('vote-7', 'motion-2', 'mem-1', 'Aye'),
('vote-8', 'motion-2', 'mem-2', 'Absent'),
('vote-9', 'motion-3', 'mp-1', 'Aye'),
('vote-10', 'motion-3', 'mp-2', 'Nay'),
('vote-11', 'motion-3', 'mp-3', 'Aye'),
('vote-12', 'motion-3', 'mem-1', 'Abstain'),
('vote-13', 'motion-3', 'mem-4', 'Aye'),
('vote-14', 'motion-4', 'mp-1', 'Nay'),
('vote-15', 'motion-4', 'mp-2', 'Nay'),
('vote-16', 'motion-4', 'mp-3', 'Nay'),
('vote-17', 'motion-4', 'mem-1', 'Abstain'),
('vote-18', 'motion-4', 'mem-4', 'Nay');
