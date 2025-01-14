import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Loader from 'components/Loader';
import axiosInstance from 'config/axiosInstance';
import { ProjectsData } from 'models/project.model';
import { media } from 'utils/media';
import Filters from 'views/ProjectPage/Filters';
import ProjectCard from 'views/ProjectPage/ProjectCard';


export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectsData[]>([]);
  const [tags, setTags] = useState<Array<string>>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectsData[]>([]);
  const [loading, setLoading] = useState(true);

  const getReposAndTags = async () => {
    try {
      const reposData = axiosInstance.get('/repo/getrepos');
      const stacksData = axiosInstance.get('/repo/gettags')
      const [{ data: repos }, { data: stacks }] = await Promise.all([reposData, stacksData])

      setProjects(repos.data)
      setTags(stacks.data);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getReposAndTags()
  }, [])

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const handleFilterChange = (query: string) => {
    const options = {
      keys: ['techStack'],
      threshold: 0.1,
    };
    const fuse = new Fuse(projects, options);
    const result = fuse.search(query);
    setFilteredProjects(query ? result.map((item) => item.item) : projects);
  };


  return (
    <>
      {loading ? (
        <FullPage>
          <Loader />
        </FullPage>
      ) : (
        <>
          <ProjectsWrapper>
            <WhiteBackgroundContainer>
              <ProjectsHeader>
                <Heading>
                  Our <span style={{ color: 'rgb(var(--yellow))' }}>Projects</span>
                </Heading>
                <Event>
                  APERTRE <span style={{ color: 'rgb(var(--yellow))' }}>&apos;24</span>
                </Event>
              </ProjectsHeader>
              <Filters onFilterChange={handleFilterChange} tags={tags} />
            </WhiteBackgroundContainer>
          </ProjectsWrapper>

          <DarkerBackgroundContainer>
            <ProjectsList>
              {filteredProjects.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            </ProjectsList>
          </DarkerBackgroundContainer>
        </>
      )}
    </>
  );
}


const FullPage = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectsWrapper = styled.div`
  width: 100%;
`;

const WhiteBackgroundContainer = styled.div`
  padding: 5rem;
  background: #000;
`;

const DarkerBackgroundContainer = styled.div`
  background: rgb(var(--background));
  padding: 5rem 0;

  ${media('<=tablet')} {
    padding: 5rem 1.5rem;
  }
`;

const ProjectsHeader = styled.h2`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProjectsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3.5rem;
  padding: 0 10rem;

  ${media('<=tablet')} {
    padding: 0 1rem;
    gap: 1.5rem;
  }

  ${media('<=phone')} {
    padding: 0 0.5rem;
  }
`;

const Heading = styled.span`
  font-size: 6.4rem;

  ${media('<=tablet')} {
    font-size: 4.3rem;
  }
`;
const Event = styled.span`
  font-size: 4rem;

  ${media('<=tablet')} {
    font-size: 3rem;
  }
`;
