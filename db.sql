SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `palp`
--

-- --------------------------------------------------------

--
-- Table structure for table `classrooms`
--

CREATE TABLE `classrooms` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `classroom_users`
--

CREATE TABLE `classroom_users` (
  `classroom_id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `visible_for_classrooms` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `problem_classrooms`
--

CREATE TABLE `problem_classrooms` (
  `problem_id` int(11) UNSIGNED NOT NULL,
  `classroom_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `problem_editors`
--

CREATE TABLE `problem_editors` (
  `problem_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(10) UNSIGNED NOT NULL,
  `success` tinyint(1) NOT NULL,
  `msg` varchar(15) NOT NULL,
  `last_checked_test` int(11) UNSIGNED NOT NULL,
  `subproblem_id` varchar(36) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `subproblems`
--

CREATE TABLE `subproblems` (
  `id` varchar(36) NOT NULL,
  `position` smallint(5) UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `type` tinyint(11) UNSIGNED NOT NULL,
  `language` varchar(30) NOT NULL,
  `optional` tinyint(1) NOT NULL,
  `grade` smallint(11) NOT NULL,
  `problem_id` int(11) UNSIGNED NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `id` varchar(36) NOT NULL,
  `position` mediumint(8) UNSIGNED NOT NULL,
  `input` text NOT NULL,
  `right_answer` text NOT NULL,
  `subproblem_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(40) NOT NULL,
  `role` tinyint(4) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `classroom_users`
--
ALTER TABLE `classroom_users`
  ADD PRIMARY KEY (`classroom_id`,`user_id`),
  ADD KEY `classroom_users_ibfk_1` (`user_id`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `problem_classrooms`
--
ALTER TABLE `problem_classrooms`
  ADD PRIMARY KEY (`problem_id`,`classroom_id`),
  ADD UNIQUE KEY `problem_id` (`problem_id`,`classroom_id`),
  ADD KEY `problem_classrooms_ibfk_2` (`classroom_id`);

--
-- Indexes for table `problem_editors`
--
ALTER TABLE `problem_editors`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `problem_id` (`problem_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subproblem_id` (`subproblem_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subproblems`
--
ALTER TABLE `subproblems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `problem_id` (`problem_id`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subproblem_id` (`subproblem_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `classroom_users`
--
ALTER TABLE `classroom_users`
  ADD CONSTRAINT `classroom_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classroom_users_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `problem_classrooms`
--
ALTER TABLE `problem_classrooms`
  ADD CONSTRAINT `problem_classrooms_ibfk_1` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `problem_classrooms_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `problem_editors`
--
ALTER TABLE `problem_editors`
  ADD CONSTRAINT `problem_editors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `problem_editors_ibfk_2` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`subproblem_id`) REFERENCES `subproblems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subproblems`
--
ALTER TABLE `subproblems`
  ADD CONSTRAINT `subproblems_ibfk_1` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`subproblem_id`) REFERENCES `subproblems` (`id`) ON DELETE CASCADE;

