module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '// <%= pkg.name %> v<%= pkg.version %>\n' +
                '// (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                '// Distributed Under MIT License\n',
      },
      dist: {
        src: ['dist/fnky.js'],
        dest: 'dist/fnky.js',
      },
    },
    browserify: {
      'dist/fnky.js': ['index.js'],
      options: {
        standalone: 'fnky'
      }
    },
    simplemocha: {
      src: ['test/**/*_test.js'],
      options: {
        globals: ['expect'],
        reporter: 'spec'
      }
    },
    mocha: {
      src: ['test/client/runner.html'],
      options: {
        mocha: {
          ignoreLeaks: false
        },
        reporter: 'Spec',
        run: true,

        timeout: 10000
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.task.registerTask('chai-globals', 'Load chai globals', function() {
    require('./test/chai');
  });

  grunt.task.registerTask('test:client', ['build', 'mocha']);
  grunt.task.registerTask('test:server', ['chai-globals', 'simplemocha']);
  grunt.task.registerTask('test:all', ['test:server', 'test:client']);
  grunt.registerTask('build', ['browserify', 'concat']);
  grunt.registerTask('default', ['test:server']);
};