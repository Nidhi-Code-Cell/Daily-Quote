-- Create quotes table for your own database
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert inspiring quotes organized by category
INSERT INTO quotes (content, author, category) VALUES
-- Motivation Quotes
('The only way to do great work is to love what you do', 'Steve Jobs', 'motivation'),
('Innovation distinguishes between a leader and a follower', 'Steve Jobs', 'leadership'),
('Stay hungry, stay foolish', 'Steve Jobs', 'wisdom'),
('Life is what happens when you''re busy making other plans', 'John Lennon', 'life'),
('The future belongs to those who believe in the beauty of their dreams', 'Eleanor Roosevelt', 'inspiration'),
('The only impossible thing is that which you don''t attempt', 'Unknown', 'motivation'),
('Success is not final, failure is not fatal: it is the courage to continue that counts', 'Winston Churchill', 'success'),
('Be yourself; everyone else is already taken', 'Oscar Wilde', 'individuality'),
('The way to get started is to quit talking and begin doing', 'Walt Disney', 'action'),
('Don''t watch the clock; do what it does. Keep going', 'Sam Levenson', 'persistence'),
('Whether you think you can, or you think you can''t – you''re right', 'Henry Ford', 'mindset'),
('The two most important days in your life are the day you are born and the day you find out why', 'Mark Twain', 'purpose'),
('Whatever you are, be a good one', 'Abraham Lincoln', 'character'),
('The best time to plant a tree was 20 years ago. The second best time is now', 'Chinese Proverb', 'wisdom'),
('Your limitation—it''s only your imagination', 'Unknown', 'possibility'),
('Great things never come from comfort zones', 'Unknown', 'growth'),
('Dream big and dare to fail', 'Norman Vaughan', 'ambition'),
('It does not matter how slowly you go as long as you do not stop', 'Confucius', 'persistence'),
('Everything you''ve ever wanted is on the other side of fear', 'George Addair', 'courage'),
('Believe you can and you''re halfway there', 'Theodore Roosevelt', 'belief'),
('Success is not how high you have climbed, but how you make a positive difference to the world', 'Roy T. Bennett', 'success'),
('Hard work beats talent when talent doesn''t work hard', 'Tim Notke', 'hard work'),
('You miss 100% of the shots you don''t take', 'Wayne Gretzky', 'opportunity'),
('The harder I work, the luckier I get', 'Gary Player', 'effort'),
('Don''t be afraid to give up the good to go for the great', 'John D. Rockefeller', 'ambition'),
('I have not failed. I''ve just found 10,000 ways that won''t work', 'Thomas Edison', 'failure'),
('A person who never made a mistake never tried anything new', 'Albert Einstein', 'learning'),
('The only impossible journey is the one you never begin', 'Tony Robbins', 'action'),
('In the middle of difficulty lies opportunity', 'Albert Einstein', 'challenge'),
('What lies behind us and what lies before us are tiny matters compared to what lies within us', 'Ralph Waldo Emerson', 'inner strength'),
('Quality is not an act, it is a habit', 'Aristotle', 'excellence'),
('The future depends on what you do today', 'Mahatma Gandhi', 'action'),
('It is never too late to be what you might have been', 'George Eliot', 'transformation'),
('Act as if what you do makes a difference', 'William James', 'impact'),
('Success consists of going from failure to failure without loss of enthusiasm', 'Winston Churchill', 'resilience'),
('The only limit to our realization of tomorrow will be our doubts of today', 'Franklin D. Roosevelt', 'possibility'),
('Do not go where the path may lead, go instead where there is no path and leave a trail', 'Ralph Waldo Emerson', 'leadership'),
('Education is the most powerful weapon which you can use to change the world', 'Nelson Mandela', 'education'),
('The best way to predict the future is to create it', 'Peter Drucker', 'innovation'),
('You are never too old to set another goal or to dream a new dream', 'C.S. Lewis', 'aspiration'),
('What we think, we become', 'Buddha', 'mindfulness'),
('The mind is everything. What you think you become', 'Buddha', 'thoughts'),
('Happiness is not something ready made. It comes from your own actions', 'Dalai Lama', 'happiness'),
('The only true wisdom is in knowing you know nothing', 'Socrates', 'humility'),
('To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment', 'Ralph Waldo Emerson', 'authenticity'),
('I have learned over the years that when one''s mind is made up, this diminishes fear', 'Rosa Parks', 'courage'),
('The only thing we have to fear is fear itself', 'Franklin D. Roosevelt', 'fear'),
('Life is 10% what happens to you and 90% how you react to it', 'Charles R. Swindoll', 'attitude'),
('The greatest glory in living lies not in never falling, but in rising every time we fall', 'Nelson Mandela', 'resilience'),
('Change your thoughts and you change your world', 'Norman Vincent Peale', 'transformation'),
('Don''t wait for opportunity. Create it', 'Unknown', 'initiative'),
('The harder the conflict, the more glorious the triumph', 'Thomas Paine', 'challenge'),
('What you get by achieving your goals is not as important as what you become by achieving your goals', 'Zig Ziglar', 'growth'),
('Believe in yourself and all that you are', 'Unknown', 'self-belief'),
('The secret of getting ahead is getting started', 'Mark Twain', 'action'),
('Don''t count the days, make the days count', 'Muhammad Ali', 'purpose'),
('Opportunity dances with those already on the dance floor', 'Shirley Brown', 'opportunity'),
('The way to get started is to quit talking and begin doing', 'Walt Disney', 'execution'),
('Your time is limited, don''t waste it living someone else''s life', 'Steve Jobs', 'authenticity'),
('The best revenge is massive success', 'Frank Sinatra', 'success'),
('I can''t change the direction of the wind, but I can adjust my sails to always reach my destination', 'Jimmy Dean', 'adaptability'),
('Accustom yourself continually to make many acts of love, for they enkindle and melt the soul.', 'Saint Teresa of Avila', 'spiritual'),

('You can search throughout the entire universe for someone who is more deserving of your love and affection than you are yourself, and that person is not to be found anywhere. You yourself, as much as anybody in the entire universe deserve your love and affection.', 'Buddha', 'self-love'),

('The most powerful weapon on earth is the human soul on fire.', 'Ferdinand Foch', 'motivation'),

('What we have once enjoyed we can never lose. All that we love deeply becomes a part of us.', 'Helen Keller', 'life'),

('The one thing we can never get enough of is love. And the one thing we never give enough is love.', 'Henry Miller', 'love'),

('You''ve done it before and you can do it now. See the positive possibilities. Redirect the substantial energy of your frustration and turn it into positive, effective, unstoppable determination.', 'Ralph Marston', 'motivation'),

('Few things in the world are more powerful than a positive push. A smile. A world of optimism and hope. A ''you can do it'' when things are tough.', 'Richard M. DeVos', 'motivation'),

('If you''re not making mistakes, then you''re not doing anything. I''m positive that a doer makes mistakes.', 'John Wooden', 'growth'),

('The gift of fantasy has meant more to me than my talent for absorbing positive knowledge.', 'Albert Einstein', 'creativity'),

('You''re going to go through tough times - that''s life. But I say, ''Nothing happens to you, it happens for you.'' See the positive in negative events.', 'Joel Osteen', 'positivity'),

('A lot of times people look at the negative side of what they feel they can''t do. I always look on the positive side of what I can do.', 'Chuck Norris', 'confidence'),

('Our chief want is someone who will inspire us to be what we know we could be.', 'Ralph Waldo Emerson', 'inspiration'),

('When you wake up every day, you have two choices. You can either be positive or negative; an optimist or a pessimist. I choose to be an optimist.', 'Harvey Mackay', 'mindset'),

('When you do something with a lot of honesty, appetite and commitment, the input reflects in the output.', 'A. R. Rahman', 'work'),

('Wisdom comes from within. Knowledge is acquired and can sometimes put a screen on your wisdom.', 'A. R. Rahman', 'wisdom'),

('The more I compose, the more I know that I don''t know it all. If you think you know it all, the work becomes repetition.', 'A. R. Rahman', 'creativity'),

('Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.', 'Buddha', 'peace'),

('Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.', 'Buddha', 'mindfulness'),

('Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared.', 'Buddha', 'happiness'),

('There are only two mistakes one can make along the road to truth; not going all the way, and not starting.', 'Buddha', 'truth'),

('A good wife is one who serves her husband in the morning like a mother does, loves him in the day like a sister does and pleases him in the night.', 'Chanakya', 'relationships'),

('A person should not be too honest. Straight trees are cut first and honest people are harmed first.', 'Chanakya', 'life'),

('The fragrance of flowers spreads only in the direction of the wind. But the goodness of a person spreads in all directions.', 'Chanakya', 'character'),

('Education is the best friend. An educated person is respected everywhere.', 'Chanakya', 'education'),

('There is some self-interest behind every friendship. There is no friendship without self-interests.', 'Chanakya', 'reality'),

('Never share your secrets with anybody. It will destroy you.', 'Chanakya', 'wisdom'),

('Never make friends with people who are above or below you in status.', 'Chanakya', 'relationships'),

('We should not fret for what is past, nor should we be anxious about the future.', 'Chanakya', 'philosophy'),

('Books are as useful to a stupid person as a mirror is useful to a blind person.', 'Chanakya', 'education'),

('I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.', 'Alexander the Great', 'leadership'),

('Whatever possession we gain by our sword cannot be lasting, but the love gained by kindness is durable.', 'Alexander the Great', 'leadership'),

('Heaven cannot brook two suns, nor earth two masters.', 'Alexander the Great', 'power'),

('I had rather excel others in the knowledge of what is excellent than in power.', 'Alexander the Great', 'wisdom'),

('The whole secret of existence is to have no fear.', 'Swami Vivekananda', 'spiritual'),

('The world is the great gymnasium where we come to make ourselves strong.', 'Swami Vivekananda', 'strength'),

('Where can we go to find God if we cannot see Him in our own hearts and in every living being.', 'Swami Vivekananda', 'spiritual');
