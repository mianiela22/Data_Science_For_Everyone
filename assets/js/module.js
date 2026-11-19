/* The module's table of contents, shared by the home page and Chapter 0's island map. */
window.MODULE = {
  title: "Outwit, Outplay, Outcompute",
  subtitle: "Data Science Through Survivor",
  chapters: [
    { n: 0, title: "Day One", topic: "Welcome to the island", href: "chapters/00-day-one.html", ready: true },
    { n: 1, title: "Previously on Data Science", topic: "A short history of data science", href: "chapters/01-previously-on-data-science.html", ready: true },
    { n: 2, title: "Tribes and Keys", topic: "Relational databases, keys, foreign keys, logic" },
    { n: 3, title: "Alliance Logic", topic: "Relational calculus" },
    { n: 4, title: "The Merge", topic: "Relational algebra" },
    { n: 5, title: "Ask the Tribe", topic: "SQL: declarative queries" },
    { n: 6, title: "Counting Votes", topic: "SQL: aggregation" },
    { n: 7, title: "Blindsides and Blanks", topic: "SQL: HAVING, joins, NULLs, DDL & DML" },
    { n: 8, title: "Down the Mountain", topic: "Gradient descent" },
    { n: 9, title: "Newton's Shortcut", topic: "Newton's method" },
    { n: 10, title: "The Whole Island Votes", topic: "Big data and MapReduce" },
  ],
  nextSeason: [
    "Imperative SQL", "Modeling", "EM Algorithm", "Spark (Python)", "Supervised Learning",
    "Linear Regression", "Generalized Linear Models", "Overfitting & Regularization", "Outliers",
    "Neural Networks", "RNNs", "LSTM", "Unsupervised Learning", "Mixture Models",
  ],
};
