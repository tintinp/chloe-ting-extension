import numpy as np
import matplotlib.pyplot as plt
import tensorflow.compat.v1 as tf
tf.compat.v1.disable_eager_execution()
# import tensorflow as tf


# -----------------------------------------------------------------------------
# Configurations
# -----------------------------------------------------------------------------
n_classes = 3  # labels.shape[1]
n_features = 193  # features.shape[1]

n_neurons_hidden_1 = 280
n_neurons_hidden_2 = 300

training_epochs = 5000
learning_rate = 0.01
sd = 1 / np.sqrt(n_features)

# Declare training data placeholders
# Extracted mfccs, chroma, mel, contrast, tonnetz features from each audio sample
# They added up to 193 features
X = tf.placeholder(tf.float32, [None, n_features])

# Output data placeholders
# 3 classes - Chloe's voice, beep, and background noise
Y = tf.placeholder(tf.float32, [None, n_classes])

# -----------------------------------------------------------------------------
# Hidden layer 1
# -----------------------------------------------------------------------------
# Weight and bias for each layer of the network
# Initialize weight with random normal distribution with mean of 0 and stddev of sd
W_1 = tf.Variable(tf.random_normal(
    [n_features, n_neurons_hidden_1], mean=0, stddev=sd))
b_1 = tf.Variable(tf.random_normal([n_neurons_hidden_1], mean=0, stddev=sd))

# Value output from activation function at hidden layer 1
h_1 = tf.nn.tanh(tf.matmul(X, W_1) + b_1)

# -----------------------------------------------------------------------------
# Hidden layer 2
# -----------------------------------------------------------------------------
W_2 = tf.Variable(tf.random_normal(
    [n_neurons_hidden_1, n_neurons_hidden_2], mean=0, stddev=sd))
b_2 = tf.Variable(tf.random_normal([n_neurons_hidden_2], mean=0, stddev=sd))
h_2 = tf.nn.sigmoid(tf.matmul(h_1, W_2) + b_2)

# -----------------------------------------------------------------------------
# Output layer
# -----------------------------------------------------------------------------
W = tf.Variable(tf.random_normal(
    [n_neurons_hidden_2, n_classes], mean=0, stddev=sd))
b = tf.Variable(tf.random_normal([n_classes], mean=0, stddev=sd))
# Prediction y_
y_ = tf.nn.softmax(tf.matmul(h_2, W) + b)

# -----------------------------------------------------------------------------
# Set up
# -----------------------------------------------------------------------------
# Initialize TensorFlow variables
init = tf.global_variables_initializer()
# Define cost function
cost_function = -tf.reduce_sum(Y * tf.log(y_))
# Specify optimizer
optimizer = tf.train.GradientDescentOptimizer(
    learning_rate).minimize(cost_function)
# Get array of booleans
correct_prediction = tf.equal(tf.argmax(y_, 1), tf.argmax(Y, 1))
# Cast booleans to 0 and 1 and find the mean accuracy
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

# -----------------------------------------------------------------------------
# Training
# -----------------------------------------------------------------------------


def train(features, labels):
    cost_history = np.empty(shape=[1], dtype=float)

    with tf.Session() as sess:
        sess.run(init)
        for epoch in range(training_epochs):
            grad, cost = sess.run([optimizer, cost_function],
                                  feed_dict={X: features, Y: labels})
            cost_history = np.append(cost_history, cost)

            print('Test accuracy: ',
                  round(sess.run(accuracy, feed_dict={X: features, Y: labels}), 3))

    plt.figure()
    plt.plot(cost_history)
    plt.axis([0, training_epochs, 0, np.max(cost_history)])
    plt.show()
