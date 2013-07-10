module.exports = function(grunt) {
  grunt.initConfig({
    simplemocha: {
      server: {
        src: ['test/**/*_test.js'],
        options: {
          globals: ['should'],
          reporter: 'spec'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('default', 'simplemocha');
};